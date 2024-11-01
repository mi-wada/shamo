import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
	return c.text("🔥");
});

app.get("/healthz", (c) => {
	return c.text("ok");
});

export default app;
