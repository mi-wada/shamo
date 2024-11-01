import { Hono } from "hono";
import { findRoomById } from "./room";
import { NOT_FOUND_ERROR } from "./error";

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

app.get("/rooms/:roomId", (c) => {
	const roomId = c.req.param("roomId");

	const room = findRoomById(roomId);
	if (!room) {
		return c.json({ error: NOT_FOUND_ERROR }, 404);
	}

	return c.json(room);
});

export default app;
