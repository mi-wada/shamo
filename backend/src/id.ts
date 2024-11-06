import { v7 } from "uuid";

export type Id = string;

export const NewId = (): Id => {
	return v7();
};
