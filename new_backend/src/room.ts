export type Room = {
	id: string;
	name: string;
	emoji: string;
};

export const findRoomById = (roomId: string): Room | undefined => {
	return rooms.find((r) => r.id === roomId);
};

const rooms: Array<Room> = [
	{
		id: "1",
		name: "My Room",
		emoji: "🔥",
	},
	{
		id: "2",
		name: "My Room 2",
		emoji: "🔥",
	},
];
