export const currentRFC3339 = (): string => new Date().toISOString();

export const toSnakeCase = (s: string): string => {
	return s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
};

// biome-ignore lint/suspicious/noExplicitAny: .
export const toSnakeCaseKeysObj = (obj: any): any => {
	if (obj === null || obj === undefined) {
		return obj;
	}
	if (Array.isArray(obj)) {
		return obj.map(toSnakeCaseKeysObj);
	}
	if (typeof obj !== "object") {
		return obj;
	}

	return Object.keys(obj).reduce((acc, key) => {
		const snakeKey = toSnakeCase(key);
		acc[snakeKey] = toSnakeCaseKeysObj(obj[key]);
		return acc;
		// biome-ignore lint/suspicious/noExplicitAny: .
	}, {} as any);
};
