export type Room = {
	id: string;
	name: string;
	emoji: string;
};

export type RoomUser = {
	userId: string;
	name: string;
	paymentsTotalAmount: number;
	roomId: string;
	iconUrl: string;
};

export type Payment = {
	id: string;
	userName: string;
	roomId: string;
	amount: number;
	note: string;
	createdAt: string;
};
