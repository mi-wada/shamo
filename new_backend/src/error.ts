export type Error = {
	code: ErrorCode;
	message: string;
};

export enum ErrorCode {
	NotFound = "NotFound",
}

export const NOT_FOUND_ERROR: Error = {
	code: ErrorCode.NotFound,
	message: "Not found",
};
