export type ErrorResponseBody = {
	error: {
		code: string;
		message: string;
	};
};

type RoomUserResponseBody = {
	user_id: string;
	name: string;
	icon_url: string;
	room_id: string;
	payments_total_amount: number;
};

export const getRoomUsers = async (
	baseUrl: string,
	fetcher: Fetcher,
	roomId: string,
): Promise<Array<RoomUserResponseBody>> => {
	const response = await fetcher.fetch(`${baseUrl}/rooms/${roomId}/users`);
	if (!response.ok) {
		throw new Error("Failed to fetch room users data");
	}
	return response.json();
};
