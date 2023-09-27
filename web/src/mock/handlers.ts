import { rest } from "msw";

const getRoomHandler = rest.get("http://localhost:8080/rooms/:roomId", (req, res, ctx) => {
  const { roomId } = req.params;

  return res(
    ctx.status(200),
    ctx.json({
      id: roomId,
      name: "ほげほげ",
      created_by: "550e8400-e29b-41d4-a716-446655440000",
      members: [
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          room_id: roomId,
          user: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            name: "ほげ",
            icon_url:
              "https://lh3.googleusercontent.com/a-/ALV-UjWjcjWgV7GpAO8x9mh4B2ryGRsmCxRGVlVvmvHgofq6Hpk=s128-p-k-rw-no",
          },
          total_amount: 1200,
        },
        {
          id: "550e1200-e29b-41d4-a716-446655440001",
          room_id: roomId,
          user: {
            id: "550e1200-e29b-41d4-a716-446655440001",
            name: "ふが",
            icon_url:
              "https://lh3.googleusercontent.com/a/ACg8ocLPV3xr7Eyo-hVtDdsCAaSMj37x_LOWAF-9dy5eyhT2EA=s80-p",
          },
          total_amount: 4300,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          room_id: roomId,
          user: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            name: "ほげ",
            icon_url:
              "https://lh3.googleusercontent.com/a-/ALV-UjWjcjWgV7GpAO8x9mh4B2ryGRsmCxRGVlVvmvHgofq6Hpk=s128-p-k-rw-no",
          },
          total_amount: 1200,
        },
        {
          id: "550e1200-e29b-41d4-a716-446655440003",
          room_id: roomId,
          user: {
            id: "550e1200-e29b-41d4-a716-446655440001",
            name: "ふが",
            icon_url:
              "https://lh3.googleusercontent.com/a/ACg8ocLPV3xr7Eyo-hVtDdsCAaSMj37x_LOWAF-9dy5eyhT2EA=s80-p",
          },
          total_amount: 4300,
        },
      ],
    }),
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
          amount: 500,
          room_id: roomId,
          room_member_id: "550e8400-e29b-41d4-a716-446655440000",
          note: "coffee",
          created_at: "2021-08-01T00:00:00.000Z",
        },
        {
          id: "550e1200-e29b-41d4-a716-446655440001",
          amount: 2000,
          room_id: roomId,
          room_member_id: "550e1200-e29b-41d4-a716-446655440001",
          note: "cake",
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
    const { memberId, note } = await req.json();

    return res(
      ctx.status(201),
      ctx.json({
        id: "550e8400-e29b-41d4-a716-446655440000",
        amount: 500,
        room_id: roomId,
        member_id: memberId,
        note: note,
        created_at: "2021-08-01T00:00:00.000Z",
      }),
    );
  },
);

const deletePaymentsHandler = rest.delete(
  "http://localhost:8080/rooms/:roomId/payments/:paymentId",
  (_req, res, ctx) => {
    return res(ctx.status(204));
  },
);

export const handlers = [
  getRoomHandler,
  getPaymentsHandler,
  postPaymentsHandler,
  deletePaymentsHandler,
];
