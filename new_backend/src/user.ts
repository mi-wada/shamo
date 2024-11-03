import { NewId, type Id } from "./id";

export type User = {
	id: UserId;
	name: string;
	iconUrl: string;
};
export type NewUserError = undefined | NewUserNameError | NewUserIconUrlError;
export const newUser = (
	name: UserName,
	iconUrl?: UserIconUrl,
): [User | undefined, NewUserError] => {
	const [n, nErr] = newUserName(name);
	if (nErr) {
		return [undefined, nErr];
	}

	const [iu, iuErr] = newUserIconUrl(iconUrl);
	if (iuErr) {
		return [undefined, iuErr];
	}

	return [
		{
			id: newUserId(),
			name: n,
			iconUrl: iu,
		},
		undefined,
	];
};

export type UserId = Id;
export const newUserId = (): UserId => {
	return `u-${NewId()}`;
};

type UserName = string;
const UserNameMaxLen = 20;
type NewUserNameError = undefined | "NameRequired" | "NameTooLong";
const newUserName = (name?: string): [UserName, NewUserNameError] => {
	if (!name) {
		return ["", "NameRequired"];
	}
	if (name.length > UserNameMaxLen) {
		return ["", "NameTooLong"];
	}

	return [name, undefined];
};

type UserIconUrl = string;
const UserIconUrlMaxLen = 1000;
type NewUserIconUrlError = undefined | "IconUrlInvalid" | "IconUrlTooLong";
const newUserIconUrl = (
	iconUrl?: string,
): [UserIconUrl, NewUserIconUrlError] => {
	if (!iconUrl) {
		return [randomUserIconUrl(), undefined];
	}
	if (!isValidUrl(iconUrl)) {
		return ["", "IconUrlInvalid"];
	}
	if (iconUrl.length > UserIconUrlMaxLen) {
		return ["", "IconUrlTooLong"];
	}

	return [iconUrl, undefined];
};
const isValidUrl = (url: string): boolean => {
	try {
		new URL(url);
		return true;
	} catch (e) {
		return false;
	}
};
export const randomUserIconUrl = (): string => {
	const seed = Math.random().toString();
	return `https://api.dicebear.com/9.x/pixel-art/png?seed=${seed}`;
};
