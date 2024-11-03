import { NewId } from "./id";

export type Room = {
	id: string;
	name: string;
	emoji: string;
};

export type RoomTable = {
	id: string;
	name: string;
	emoji: string;
	// TODO: UTCかつTZ保存されてないのしんどい。直す。
	created_at: string;
};

export const insertRoom = async (db: D1Database, room: Room): Promise<Room> => {
	await db
		.prepare("INSERT INTO rooms (id, name, emoji) VALUES (?, ?, ?);")
		.bind(room.id, room.name, room.emoji)
		.run();

	return room;
};

export type NewRoomError = undefined | NewRoomNameError | NewRoomEmojiError;
export const newRoom = (
	name: string,
	emoji: string,
): [Room | undefined, NewRoomError] => {
	const [n, nErr] = newRoomName(name);
	if (nErr) {
		return [undefined, nErr];
	}

	const [e, eErr] = newRoomEmoji(emoji);
	if (eErr) {
		return [undefined, eErr];
	}

	return [
		{
			id: newRoomId(),
			name: n,
			emoji: e,
		},
		undefined,
	];
};

export type RoomId = string;
export const newRoomId = (): RoomId => {
	return `r-${NewId()}`;
};

type RoomName = string;
const RoomNameMaxLen = 20;
type NewRoomNameError = undefined | "NameRequired" | "NameTooLong";
const newRoomName = (name?: string): [RoomName, NewRoomNameError] => {
	if (!name) {
		return ["", "NameRequired"];
	}
	if (name.length > RoomNameMaxLen) {
		return ["", "NameTooLong"];
	}

	return [name, undefined];
};

type RommEmoji = string;
type NewRoomEmojiError = undefined | "EmojiRequired" | "EmojiInvalid";
const newRoomEmoji = (emoji?: string): [RommEmoji, NewRoomEmojiError] => {
	if (!emoji) {
		return ["", "EmojiRequired"];
	}
	if (!isEmoji(emoji)) {
		return ["", "EmojiInvalid"];
	}

	return [emoji, undefined];
};
// TODO: fix it
const isEmoji = (emoji: string): boolean => {
	return Array.from(emoji).length === 1;
};
