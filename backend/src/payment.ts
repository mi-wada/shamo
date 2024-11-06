import { currentRFC3339 } from "../utils";
import { NewId, type Id } from "./id";
import type { RoomId } from "./room";
import type { UserId } from "./user";

export type Payment = {
	id: PaymentId;
	userId: UserId;
	roomId: RoomId;
	amount: PaymentAmount;
	note: PaymentNote;
	createdAt: string;
};

type PaymentTable = {
	id: string;
	user_id: string;
	room_id: string;
	amount: number;
	note: string;
	created_at: string;
};

export const insertPayment = async (
	db: D1Database,
	payment: Payment,
): Promise<Payment> => {
	await db.batch([
		db
			.prepare(
				"INSERT INTO payments (id, user_id, room_id, amount, note, created_at) VALUES (?, ?, ?, ?, ?, ?);",
			)
			.bind(
				payment.id,
				payment.userId,
				payment.roomId,
				payment.amount,
				payment.note,
				payment.createdAt,
			),
		db
			.prepare(
				"UPDATE room_users SET payments_total_amount = payments_total_amount + ? WHERE user_id = ? AND room_id = ?;",
			)
			.bind(payment.amount, payment.userId, payment.roomId),
	]);

	return payment;
};
const defaultPerPage = 20;
export const findPaymentsByRoomId = async (
	db: D1Database,
	roomId: RoomId,
	page?: number,
	perPage?: number,
): Promise<Payment[]> => {
	const limit = perPage ?? defaultPerPage;
	const offset = ((page ?? 1) - 1) * limit;

	const { results: paymentRecords } = await db
		.prepare(
			"SELECT * FROM payments WHERE room_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?;",
		)
		.bind(roomId, limit, offset)
		.all<PaymentTable>();

	return paymentRecords.map((r) => {
		return {
			id: r.id,
			userId: r.user_id,
			roomId: r.room_id,
			amount: r.amount,
			note: r.note,
			createdAt: r.created_at,
		};
	});
};
export const deletePayment = async (
	db: D1Database,
	paymentId: PaymentId,
	roomId: RoomId,
): Promise<void> => {
	const paymentRecord = await db
		.prepare("SELECT * FROM payments WHERE id = ? AND room_id = ?;")
		.bind(paymentId, roomId)
		.first<PaymentTable>();
	if (!paymentRecord) {
		return;
	}

	await db.batch([
		db
			.prepare("DELETE FROM payments WHERE id = ? AND room_id = ?;")
			.bind(paymentId, roomId),
		db
			.prepare(
				"UPDATE room_users SET payments_total_amount = payments_total_amount - ? WHERE user_id = ? AND room_id = ?;",
			)
			.bind(paymentRecord.amount, paymentRecord.user_id, paymentRecord.room_id),
	]);
};

export type NewPaymentError =
	| undefined
	| NewPaymentAmountError
	| NewPaymentNoteError;
export const newPayment = (
	userId: UserId,
	roomId: RoomId,
	amount?: number,
	note?: string,
): [Payment | undefined, NewPaymentError] => {
	const [a, aErr] = newPaymentAmount(amount);
	if (aErr) {
		return [undefined, aErr];
	}

	const [n, nErr] = newPaymentNote(note);
	if (nErr) {
		return [undefined, nErr];
	}

	return [
		{
			id: newPaymentId(),
			userId,
			roomId,
			amount: a,
			note: n,
			createdAt: currentRFC3339(),
		},
		undefined,
	];
};

type PaymentId = Id;
const newPaymentId = (): PaymentId => {
	return `p-${NewId()}`;
};

type PaymentAmount = number;
type NewPaymentAmountError =
	| undefined
	| "AmountRequired"
	| "AmountMustBeNonNegative";
const newPaymentAmount = (
	amount?: number,
): [PaymentAmount, NewPaymentAmountError] => {
	if (amount === undefined) {
		return [0, "AmountRequired"];
	}
	if (amount < 0) {
		return [0, "AmountMustBeNonNegative"];
	}

	return [amount, undefined];
};

type PaymentNote = string;
const PaymentNoteMaxLen = 100;
type NewPaymentNoteError = undefined | "NoteTooLong";
const newPaymentNote = (note?: string): [PaymentNote, NewPaymentNoteError] => {
	if (!note) {
		return ["", undefined];
	}
	if (note.length > PaymentNoteMaxLen) {
		return ["", "NoteTooLong"];
	}

	return [note, undefined];
};
