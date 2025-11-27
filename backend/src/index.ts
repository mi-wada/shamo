import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import {
	badRequestError,
	INTERNAL_SERVER_ERROR,
	NOT_FOUND_ERROR,
} from "./error";
import {
	deletePayment,
	findPaymentsByRoomId,
	insertPayment,
	newPayment,
} from "./payment";
import { findRoomById, insertRoom, newRoom } from "./room";
import {
	findRoomUserByRoomIdAndUserId,
	findRoomUsersByRoomId,
	insertRoomUser,
	NewRoomUser,
} from "./room_user";
import { findUserById, insertUser, newUser } from "./user";
import { toSnakeCaseKeysObj } from "./utils";

type Bindings = {
	DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

const toSnakeCaseKeysResBodyMiddleware = createMiddleware(async (c, next) => {
	await next();

	// biome-ignore lint/suspicious/noImplicitAnyLet: .
	let originalRes;
	try {
		const clonedRes = c.res.clone();
		originalRes = await clonedRes.json();
	} catch (_error) {
		return;
	}
	const res = toSnakeCaseKeysObj(originalRes);
	c.res = new Response(JSON.stringify(res), c.res);
});
app.use(toSnakeCaseKeysResBodyMiddleware);

app.get("/", (c) => {
	return c.text("🔥");
});

app.get("/healthz", (c) => {
	return c.text("ok");
});

// without icon_url: curl -X POST http://localhost:8787/users -d '{"name": "Alice"}' -H 'Content-Type: application/json'
// with icon_url: curl -X POST http://localhost:8787/users -d '{"name": "Alice", "icon_url": "https://api.dicebear.com/9.x/pixel-art/png?seed=Alice"}' -H 'Content-Type: application/json'
type CreateUserPayload = {
	name: string;
	icon_url: string;
};
app.post("/users", async (c) => {
	const { name, icon_url }: CreateUserPayload = await c.req.json();

	const [user, err] = newUser(name, icon_url);
	if (err) {
		return c.json({ error: badRequestError(err) }, 400);
	}
	if (!user) {
		return c.json({ error: INTERNAL_SERVER_ERROR }, 500);
	}

	await insertUser(c.env.DB, user);

	return c.json(user, 201);
});

// curl -X POST http://localhost:8787/rooms -d '{"user_id": "u-0192f06d-2f59-712e-a74b-65535d8d1863", "name": "2024-11-03 旅行", "emoji": "🍜"}' -H 'Content-Type: application/json'
type CreateRoomPayload = {
	user_id?: string;
	name?: string;
	emoji?: string;
};
app.post("/rooms", async (c) => {
	const { user_id, name, emoji }: CreateRoomPayload = await c.req.json();

	if (!user_id) {
		return c.json({ error: badRequestError("UserIdRequired") }, 400);
	}
	const user = await findUserById(c.env.DB, user_id);
	if (!user) {
		return c.json({ error: NOT_FOUND_ERROR }, 404);
	}

	const [room, err] = newRoom(name, emoji);
	if (err) {
		return c.json({ error: badRequestError(err) }, 400);
	}
	if (!room) {
		return c.json({ error: INTERNAL_SERVER_ERROR }, 500);
	}

	await insertRoom(c.env.DB, room);

	return c.json(room, 201);
});

// curl -X GET http://localhost:8787/rooms/r-0192f06d-e7a1-77d7-90f7-3d4ae1a96a50
app.get("/rooms/:roomId", async (c) => {
	const roomId = c.req.param("roomId");

	const room = await findRoomById(c.env.DB, roomId);
	if (!room) {
		return c.json({ error: NOT_FOUND_ERROR }, 404);
	}

	return c.json(room);
});

// curl -X POST http://localhost:8787/rooms/r-0192f06d-e7a1-77d7-90f7-3d4ae1a96a50/users -d '{"user_id": "u-0192f06d-2f59-712e-a74b-65535d8d1863"}' -H 'Content-Type: application/json'
type CreateRoomUserPayload = {
	user_id: string;
};
app.post("/rooms/:roomId/users", async (c) => {
	const roomId = c.req.param("roomId");
	const { user_id }: CreateRoomUserPayload = await c.req.json();

	if (!user_id) {
		return c.json({ error: badRequestError("UserIdRequired") }, 400);
	}
	const user = await findUserById(c.env.DB, user_id);
	if (!user) {
		return c.json({ error: NOT_FOUND_ERROR }, 404);
	}

	const room = await findRoomById(c.env.DB, roomId);
	if (!room) {
		return c.json({ error: NOT_FOUND_ERROR }, 404);
	}

	const roomUser = NewRoomUser(user, roomId);
	const [_, err] = await insertRoomUser(c.env.DB, roomUser);
	if (err) {
		return c.json({ error: badRequestError(err) }, 400);
	}

	return c.json(roomUser, 201);
});

// curl -X GET http://localhost:8787/rooms/r-0192f06d-e7a1-77d7-90f7-3d4ae1a96a50/users
app.get("/rooms/:roomId/users", async (c) => {
	const roomId = c.req.param("roomId");

	const room = await findRoomById(c.env.DB, roomId);
	if (!room) {
		return c.json({ error: NOT_FOUND_ERROR }, 404);
	}

	const roomUsers = await findRoomUsersByRoomId(c.env.DB, roomId);

	return c.json(roomUsers);
});

// curl -X POST http://localhost:8787/rooms/r-0192f06d-e7a1-77d7-90f7-3d4ae1a96a50/payments -d '{"user_id": "u-0192f06d-2f59-712e-a74b-65535d8d1863", "amount": 100, "note": "食費"}' -H 'Content-Type: application/json'
type CreatePaymentPayload = {
	user_id?: string;
	amount?: number;
	note?: string;
};
app.post("/rooms/:roomId/payments", async (c) => {
	const roomId = c.req.param("roomId");
	const { user_id, amount, note }: CreatePaymentPayload = await c.req.json();
	if (!user_id) {
		return c.json({ error: badRequestError("UserIdRequired") }, 400);
	}
	if (amount === undefined) {
		return c.json({ error: badRequestError("AmountRequired") }, 400);
	}

	const roomUser = await findRoomUserByRoomIdAndUserId(
		c.env.DB,
		roomId,
		user_id,
	);
	if (!roomUser) {
		return c.json({ error: NOT_FOUND_ERROR }, 404);
	}

	const [payment, err] = newPayment(user_id, roomId, amount, note);
	if (err) {
		return c.json({ error: badRequestError(err) }, 400);
	}
	if (!payment) {
		return c.json({ error: INTERNAL_SERVER_ERROR }, 500);
	}
	await insertPayment(c.env.DB, payment);

	return c.json(payment, 201);
});

// curl -X GET http://localhost:8787/rooms/r-0192f06d-e7a1-77d7-90f7-3d4ae1a96a50/payments
app.get("/rooms/:roomId/payments", async (c) => {
	const roomId = c.req.param("roomId");
	const page = Number.parseInt(c.req.query("page") ?? "1", 10);

	const room = await findRoomById(c.env.DB, roomId);
	if (!room) {
		return c.json({ error: NOT_FOUND_ERROR }, 404);
	}

	const payments = await findPaymentsByRoomId(c.env.DB, roomId, page);

	return c.json(payments);
});

// curl -X DELETE http://localhost:8787/rooms/r-0192f06d-e7a1-77d7-90f7-3d4ae1a96a50/payments/p-0192f06f-a21e-76be-8217-fed68b989856
app.delete("/rooms/:roomId/payments/:paymentId", async (c) => {
	const roomId = c.req.param("roomId");
	const paymentId = c.req.param("paymentId");

	await deletePayment(c.env.DB, paymentId, roomId);

	c.status(204);
	return c.body(null);
});

// TODO: どっかのレイヤでfieldをcamelCase -> snake_caseに変換する。ミドルウェア使うのかな。req.body, res.body両方でやりたい。

export default app;
