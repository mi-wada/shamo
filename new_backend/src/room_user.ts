import type { RoomId } from "./room";
import type { User, UserId, UserProfileTable } from "./user";

export type RoomUser = Omit<User, "id"> & {
	roomId: RoomId;
	userId: UserId;
	paymentsTotalAmount: number;
};

export type RoomUserTable = {
	room_id: string;
	user_id: string;
	payments_total_amount: number;
	created_at: string;
};
export type RoomUserJoinedUserProfileTable = RoomUserTable & UserProfileTable;

export const findRoomUsersByRoomId = async (
	db: D1Database,
	roomId: RoomId,
): Promise<RoomUser[]> => {
	const { results: roomUserRecords } = await db
		.prepare(`
SELECT * FROM room_users
	JOIN user_profiles ON room_users.user_id = user_profiles.user_id
	WHERE room_id = ?;`)
		.bind(roomId)
		.all<RoomUserJoinedUserProfileTable>();

	return roomUserRecords.map((roomUserRecord) => {
		return {
			roomId: roomUserRecord.room_id,
			userId: roomUserRecord.user_id,
			name: roomUserRecord.name,
			iconUrl: roomUserRecord.icon_url,
			paymentsTotalAmount: roomUserRecord.payments_total_amount,
		};
	});
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
			.bind(roomUser.roomId, roomUser.userId, roomUser.paymentsTotalAmount)
			.run();
		// biome-ignore lint/suspicious/noExplicitAny: https://developers.cloudflare.com/d1/observability/debug-d1/
	} catch (error: any) {
		if (error.message.includes("UNIQUE constraint failed")) {
			return [undefined, "UserIdAlreadyExists"];
		}
	}

	return [roomUser, undefined];
};

export const NewRoomUser = (user: User, roomId: RoomId): RoomUser => {
	return {
		userId: user.id,
		name: user.name,
		iconUrl: user.iconUrl,
		roomId,
		paymentsTotalAmount: 0,
	};
};
