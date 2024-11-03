export const rfc3339ToSimpleFormat = (rfc3339: string): string => {
	const date = new Date(rfc3339);
	return date.toLocaleString();
};
