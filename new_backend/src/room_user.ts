import type { RoomId } from "./room";
import type { User } from "./user";

export type RoomUser = User & {
	roomId: RoomId;
	paymentsTotalAmount: number;
};

export type RoomUserTable = {
	room_id: string;
	user_id: string;
	payments_total_amount: number;
	created_at: string;
};

export type InsertRoomUserError = undefined | "UserIdAlreadyExists";
export const insertRoomUser = async (
	db: D1Database,
	roomUser: RoomUser,
): Promise<[RoomUser | undefined, InsertRoomUserError]> => {
	try {
		await db
			.prepare(
				"INSERT INTO room_users (room_id, user_id, payments_total_amount) VALUES (?, ?, ?);",
			)
			.bind(roomUser.roomId, roomUser.id, roomUser.paymentsTotalAmount)
			.run();
		// biome-ignore lint/suspicious/noExplicitAny: https://developers.cloudflare.com/d1/observability/debug-d1/
	} catch (error: any) {
		if (error.message.includes("UNIQUE constraint failed")) {
			return [undefined, "UserIdAlreadyExists"];
		}
	}

	return [roomUser, undefined];
};
