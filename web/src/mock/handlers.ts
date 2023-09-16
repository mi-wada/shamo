import { rest } from "msw";

const getUsersHandler = rest.get("http://localhost:8080/rooms/:roomId/users", (req, res, ctx) => {
  const { roomId } = req.params;

  return res(
    ctx.status(200),
    ctx.json([
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        room_id: roomId,
        name: "John Doe",
        email: "hoge@example.com",
        picture_url: "https://example.com/hoge.png",
      },
      {
        id: "550e1200-e29b-41d4-a716-446655440001",
        room_id: roomId,
        name: "Peater Smith",
        email: "fuga@example.com",
        picture_url: "https://example.com/fuga.png",
      },
    ]),
  );
});

const getPaymentsHandler = rest.get(
  "http://localhost:8080/rooms/:roomId/payments",
  (req, res, ctx) => {
    const { roomId } = req.params;

    return res(
      ctx.status(200),
      ctx.json([
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          price: 500,
          room_id: roomId,
          user_id: "ede9e16c-efae-4fbf-89b9-6ddb55f2a475",
          what: "coffee",
          created_at: "2021-08-01T00:00:00.000Z",
        },
        {
          id: "550e1200-e29b-41d4-a716-446655440001",
          price: 2000,
          room_id: roomId,
          user_id: "ede9e16c-efae-4fbf-89b9-6d1255f2a475",
          what: "cake",
          created_at: "2021-04-01T00:00:00.000Z",
        },
      ]),
    );
  },
);

const postPaymentsHandler = rest.post(
  "http://localhost:8080/rooms/:roomId/payments",
  async (req, res, ctx) => {
    const { roomId } = req.params;
    const { userId, what } = await req.json();

    return res(
      ctx.status(201),
      ctx.json({
        id: "550e8400-e29b-41d4-a716-446655440000",
        price: 500,
        room_id: roomId,
        user_id: userId,
        what: what,
        created_at: "2021-08-01T00:00:00.000Z",
      }),
    );
  },
);

const deletePaymentsHandler = rest.delete(
  "http://localhost:8080/rooms/:roomId/payments",
  (_req, res, ctx) => {
    return res(ctx.status(204));
  },
);

export const handlers = [
  getUsersHandler,
  getPaymentsHandler,
  postPaymentsHandler,
  deletePaymentsHandler,
];
