export const rfc3339ToSimpleFormat = (rfc3339: string): string => {
	const date = new Date(rfc3339);
	return date.toLocaleDateString(undefined, {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
};
