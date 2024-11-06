import type { NewPaymentError } from "./payment";
import type { NewRoomError } from "./room";
import type { InsertRoomUserError } from "./room_user";
import type { NewUserError } from "./user";

export type Error = {
	code: ErrorCode;
	message: string;
};

type ErrorCode =
	| "NotFound"
	| "InternalServerError"
	| "UserIdRequired"
	| "AmountRequired"
	| Exclude<NewUserError, undefined>
	| Exclude<NewRoomError, undefined>
	| Exclude<InsertRoomUserError, undefined>
	| Exclude<NewPaymentError, undefined>;

export const badRequestError = (code: ErrorCode): Error => {
	return {
		code,
		message: code,
	};
};

export const NOT_FOUND_ERROR: Error = {
	code: "NotFound",
	message: "Not found",
};

export const INTERNAL_SERVER_ERROR: Error = {
	code: "InternalServerError",
	message: "Internal server error",
};
