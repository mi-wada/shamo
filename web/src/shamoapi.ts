import type { Payment, Room, RoomUser } from "./type";
import { friendlyRFC3339 } from "./utils";

const baseURL = import.meta.env.VITE_API_BASE_URL;

type RoomResponseBody = {
	id: string;
	name: string;
	emoji: string;
};
export const getRoom = async (roomId: string): Promise<Room> => {
	const response = await fetch(`${baseURL}/rooms/${roomId}`);
	if (!response.ok) {
		throw new Error("Failed to fetch room");
	}
	const body: RoomResponseBody = await response.json();
	return {
		id: body.id,
		name: body.name,
		emoji: body.emoji,
	};
};

type RoomUserResponseBody = {
	user_id: string;
	name: string;
	icon_url: string;
	room_id: string;
	payments_total_amount: number;
};
export const getRoomUsers = async (
	roomId: string,
): Promise<Array<RoomUser>> => {
	const response = await fetch(`${baseURL}/rooms/${roomId}/users`);
	if (!response.ok) {
		throw new Error("Failed to fetch room users");
	}
	const body: RoomUserResponseBody[] = await response.json();
	return body.map((ru) => ({
		userId: ru.user_id,
		name: ru.name,
		iconUrl: ru.icon_url,
		roomId: ru.room_id,
		paymentsTotalAmount: ru.payments_total_amount,
	}));
};

type PaymentResponseBoby = {
	id: string;
	user_id: string;
	room_id: string;
	amount: number;
	note: string;
	created_at: string;
};
// TODO: refactor
export const getPayments = async (
	roomId: string,
	page: number,
): Promise<Array<Payment>> => {
	const response = await fetch(
		`${baseURL}/rooms/${roomId}/payments?page=${page}`,
	);
	if (!response.ok) {
		throw new Error("Failed to fetch payments");
	}
	const body: PaymentResponseBoby[] = await response.json();

	const roomUsers = await getRoomUsers(roomId);

	return body.map((payment) => ({
		id: payment.id,
		userName:
			roomUsers.find((ru) => ru.userId === payment.user_id)?.name ?? "Unknown",
		roomId: payment.room_id,
		amount: payment.amount,
		note: payment.note,
		createdAt: friendlyRFC3339(payment.created_at),
	}));
};

export const deletePayment = async (
	roomId: string,
	paymentId: string,
): Promise<void> => {
	const response = await fetch(
		`${baseURL}/rooms/${roomId}/payments/${paymentId}`,
		{
			method: "DELETE",
		},
	);
	if (!response.ok) {
		throw new Error("Failed to delete payment");
	}
};

export const postPayment = async (
	roomId: string,
	userId: string,
	amount: number,
	note: string | undefined,
): Promise<void> => {
	const response = await fetch(`${baseURL}/rooms/${roomId}/payments`, {
		method: "POST",
		body: JSON.stringify({ user_id: userId, amount: amount, note: note }),
	});
	if (!response.ok) {
		throw new Error("Failed to post payment");
	}
};
