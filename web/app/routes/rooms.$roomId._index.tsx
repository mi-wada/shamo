import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, useLoaderData } from "@remix-run/react";

type User = {
	id: string;
	name: string;
	paymentsTotalAmount: number;
	iconUrl: string;
};

type UserResponseBody = {
	id: string;
	name: string;
	icon_url: string;
	room_id: string;
	payments_total_amount: number;
};

export async function loader({ params, context }: LoaderFunctionArgs) {
	const baseURL = context.cloudflare.env.SHAMO_API_BASE_URL;

	const usersResponse = await fetch(`${baseURL}/rooms/${params.roomId}/users`);
	if (!usersResponse.ok) {
		console.log(usersResponse);
		throw new Error("Failed to fetch users data");
	}
	const usersResponseBody: Array<UserResponseBody> = await usersResponse.json();

	const users: Array<User> = usersResponseBody.map((user) => ({
		id: user.id,
		name: user.name,
		paymentsTotalAmount: user.payments_total_amount,
		iconUrl: user.icon_url,
	}));

	return json(users);
}

export default function Page() {
	const users = useLoaderData<typeof loader>();

	return (
		<>
			<h3>Users</h3>
			<ul>
				{users.map((user) => (
					<li key={user.id}>
						<img
							src={user.iconUrl}
							alt={user.name}
							className="w-12 h-12 rounded-full"
						/>
						<div>
							<p className="font-bold">{user.name}</p>
							<p>Total: {user.paymentsTotalAmount}</p>
						</div>
					</li>
				))}
			</ul>
			<h3>Add a payment</h3>
		</>
	);
}
