import type { RoomId } from "./room";
import type { User, UserId, UserProfileTable } from "./user";
import { currentRFC3339 } from "./utils";

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

	return roomUserRecords.map((r) => {
		return {
			roomId: r.room_id,
			userId: r.user_id,
			name: r.name,
			iconUrl: r.icon_url,
			paymentsTotalAmount: r.payments_total_amount,
		};
	});
};
export const findRoomUserByRoomIdAndUserId = async (
	db: D1Database,
	roomId: RoomId,
	userId: UserId,
): Promise<RoomUser | undefined> => {
	const roomUserRecord = await db
		.prepare(`
SELECT * FROM room_users
	JOIN user_profiles ON room_users.user_id = user_profiles.user_id
	WHERE room_id = ? AND room_users.user_id = ?;`)
		.bind(roomId, userId)
		.first<RoomUserJoinedUserProfileTable>();

	if (!roomUserRecord) {
		return undefined;
	}

	return {
		roomId: roomUserRecord.room_id,
		userId: roomUserRecord.user_id,
		name: roomUserRecord.name,
		iconUrl: roomUserRecord.icon_url,
		paymentsTotalAmount: roomUserRecord.payments_total_amount,
	};
};
export type InsertRoomUserError = undefined | "UserIdAlreadyExists";
export const insertRoomUser = async (
	db: D1Database,
	roomUser: RoomUser,
): Promise<[RoomUser | undefined, InsertRoomUserError]> => {
	try {
		await db
			.prepare(`
INSERT INTO
	room_users (room_id, user_id, payments_total_amount, created_at)
	VALUES (?, ?, ?, ?);
`)
			.bind(
				roomUser.roomId,
				roomUser.userId,
				roomUser.paymentsTotalAmount,
				currentRFC3339(),
			)
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
