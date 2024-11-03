import { Hono } from "hono";
import { findRoomById } from "./room";
import {
	badRequestError,
	INTERNAL_SERVER_ERROR,
	NOT_FOUND_ERROR,
} from "./error";
import { newUser, newUserId, randomUserIconUrl, type User } from "./user";

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

type CreateUserPayload = {
	name: string;
	icon_url?: string;
};

// without icon_url: curl -X POST http://localhost:8787/users -d '{"name": "Alice"}' -H 'Content-Type: application/json'
// with icon_url: curl -X POST http://localhost:8787/users -d '{"name": "Alice", "icon_url": "https://api.dicebear.com/9.x/pixel-art/png?seed=Alice"}' -H 'Content-Type: application/json'
app.post("/users", async (c) => {
	const { name, icon_url }: CreateUserPayload = await c.req.json();
	const [user, err] = newUser(name, icon_url);
	if (err) {
		return c.json({ error: badRequestError(err) }, 400);
	}
	if (!user) {
		return c.json({ error: INTERNAL_SERVER_ERROR }, 500);
	}

	c.env.DB.prepare(
		"INSERT INTO users (id, name, icon_url) VALUES (?, ?, ?);",
	).bind(user.id, user.name, user.iconUrl);

	return c.json(user, 201);
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
