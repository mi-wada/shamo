import { Hono } from "hono";
import { insertRoom, newRoom } from "./room";
import {
	badRequestError,
	INTERNAL_SERVER_ERROR,
	NOT_FOUND_ERROR,
} from "./error";
import { findUserById, insertUser, newUser } from "./user";

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
	user_id: string;
	name: string;
	emoji: string;
};
app.post("/rooms", async (c) => {
	const { user_id, name, emoji }: CreateRoomPayload = await c.req.json();

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

// app.get("/rooms/:roomId", (c) => {
// 	const roomId = c.req.param("roomId");

// 	const room = findRoomById(roomId);
// 	if (!room) {
// 		return c.json({ error: NOT_FOUND_ERROR }, 404);
// 	}

// 	return c.json(room);
// });

export default app;
