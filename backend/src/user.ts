import { type Id, NewId } from "./id";
import { currentRFC3339 } from "./utils";

export type User = {
	id: UserId;
	name: UserName;
	iconUrl: UserIconUrl;
};

export type UserTable = {
	id: string;
	created_at: string;
};
export type UserProfileTable = {
	user_id: string;
	name: string;
	icon_url: string;
};
export type UserJoinedProfileTable = UserTable &
	Exclude<UserProfileTable, "user_id">;

export const findUserById = async (
	db: D1Database,
	id: UserId,
): Promise<User | undefined> => {
	const record = await db
		.prepare(`
		SELECT users.*, user_profiles.name, user_profiles.icon_url
		FROM users
		JOIN user_profiles ON users.id = user_profiles.user_id
		WHERE users.id = ?;
	`)
		.bind(id)
		.first<UserJoinedProfileTable>();

	if (!record) {
		return undefined;
	}
	return {
		id: record.id,
		name: record.name,
		iconUrl: record.icon_url,
	};
};
export const insertUser = async (db: D1Database, user: User): Promise<User> => {
	await db.batch([
		db
			.prepare(`
INSERT INTO
	users (id, created_at)
	VALUES (?, ?);
`)
			.bind(user.id, currentRFC3339()),
		db
			.prepare(`
INSERT INTO
	user_profiles (user_id, name, icon_url)
	VALUES (?, ?, ?);
`)
			.bind(user.id, user.name, user.iconUrl),
	]);

	return user;
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
	} catch (_e) {
		return false;
	}
};
export const randomUserIconUrl = (): string => {
	const seed = Math.random().toString();
	return `https://api.dicebear.com/9.x/pixel-art/png?seed=${seed}`;
};
