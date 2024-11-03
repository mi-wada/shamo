import { Hono } from "hono";
import { findRoomById, insertRoom, newRoom } from "./room";
import {
	badRequestError,
	INTERNAL_SERVER_ERROR,
	NOT_FOUND_ERROR,
} from "./error";
import { findUserById, insertUser, newUser } from "./user";
import { insertRoomUser } from "./room_user";

type Bindings = {
	DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

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

// curl -X POST http://localhost:8787/rooms -d '{"user_id": "u-0192efe8-f923-7159-b881-9f3f2d78b67e", "name": "2024-11-03 旅行", "emoji": "🍜"}' -H 'Content-Type: application/json'
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

// curl http://localhost:8787/rooms/r-0192f002-c770-7407-8a0e-dfbde47112f7
app.get("/rooms/:roomId", async (c) => {
	const roomId = c.req.param("roomId");

	const room = await findRoomById(c.env.DB, roomId);
	if (!room) {
		return c.json({ error: NOT_FOUND_ERROR }, 404);
	}

	return c.json(room);
});

// curl -X POST http://localhost:8787/rooms/r-0192f002-c770-7407-8a0e-dfbde47112f7/users -d '{"user_id": "u-0192efe8-f923-7159-b881-9f3f2d78b67e"}' -H 'Content-Type: application/json'
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

	const roomUser = {
		...user,
		roomId,
		paymentsTotalAmount: 0,
	};
	const [_, err] = await insertRoomUser(c.env.DB, roomUser);
	if (err) {
		return c.json({ error: badRequestError(err) }, 400);
	}

	return c.json(roomUser, 201);
});

export default app;
