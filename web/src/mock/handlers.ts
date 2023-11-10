import { http } from "msw";

const getRoomHandler = http.get<{ roomId: string }>(
  "http://127.0.0.1:8080/rooms/:roomId",
  ({ params }) => {
    const { roomId } = params;

    return new Response(
      JSON.stringify({
        id: roomId,
        name: "ほげほげハウス",
        emoji: "🏠",
        created_by: "550e8400-e29b-41d4-a716-446655440000",
        members: [
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            room_id: roomId,
            user: {
              id: "550e8400-e29b-41d4-a716-446655440000",
              name: "まじょ",
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
              name: "きゅうべい",
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
              name: "みきさやか",
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
              name: "あいうえおかきくけこさし",
              icon_url:
                "https://lh3.googleusercontent.com/a/ACg8ocLPV3xr7Eyo-hVtDdsCAaSMj37x_LOWAF-9dy5eyhT2EA=s80-p",
            },
            total_amount: 4300,
          },
        ],
      }),
      { status: 200 },
    );
  },
);

const getPaymentsHandler = http.get<{ roomId: string }>(
  "http://127.0.0.1:8080/rooms/:roomId/payments",
  ({ params }) => {
    const { roomId } = params;

    return new Response(
      JSON.stringify([
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
      { status: 200 },
    );
  },
);

const postPaymentsHandler = http.post<{ roomId: string }, { memberId: string; note: string }>(
  "http://127.0.0.1:8080/rooms/:roomId/payments",
  async ({ request, params }) => {
    const { roomId } = params;
    const { memberId, note } = await request.json();

    return new Response(JSON.stringify({ roomId, memberId, note }), {
      status: 201,
    });
  },
);

const deletePaymentsHandler = http.delete(
  "http://127.0.0.1:8080/rooms/:roomId/payments/:paymentId",
  () => {
    return new Response(undefined, { status: 204 });
  },
);

export const handlers = [
  getRoomHandler,
  getPaymentsHandler,
  postPaymentsHandler,
  deletePaymentsHandler,
];
