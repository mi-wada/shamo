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
				"INSERT INTO payments (id, user_id, room_id, amount, note) VALUES (?, ?, ?, ?, ?);",
			)
			.bind(
				payment.id,
				payment.userId,
				payment.roomId,
				payment.amount,
				payment.note,
			),
		db
			.prepare(
				"UPDATE room_users SET payments_total_amount = payments_total_amount + ? WHERE user_id = ? AND room_id = ?;",
			)
			.bind(payment.amount, payment.userId, payment.roomId),
	]);

	return payment;
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
			createdAt: new Date().toISOString(),
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
