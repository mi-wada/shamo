import type {
	LoaderFunctionArgs,
	ActionFunctionArgs,
} from "@remix-run/cloudflare";
import { json, useLoaderData, redirect } from "@remix-run/react";
import { Form, useActionData } from "@remix-run/react";

type RoomUser = {
	userId: string;
	name: string;
	paymentsTotalAmount: number;
	iconUrl: string;
};

type RoomUserResponseBody = {
	user_id: string;
	name: string;
	icon_url: string;
	room_id: string;
	payments_total_amount: number;
};

export async function loader({ params, context }: LoaderFunctionArgs) {
	const baseURL = context.cloudflare.env.SHAMO_API_BASE_URL;

	const rUsersResponse = await fetch(`${baseURL}/rooms/${params.roomId}/users`);
	if (!rUsersResponse.ok) {
		console.log(rUsersResponse);
		throw new Error("Failed to fetch users data");
	}
	const usersResponseBody: Array<RoomUserResponseBody> =
		await rUsersResponse.json();

	const rUsers: Array<RoomUser> = usersResponseBody.map((ru) => ({
		userId: ru.user_id,
		name: ru.name,
		paymentsTotalAmount: ru.payments_total_amount,
		iconUrl: ru.icon_url,
	}));

	return json(rUsers);
}

type ErrorResponseBody = {
	error: {
		code: string;
		message: string;
	};
};

export async function action({ request, params, context }: ActionFunctionArgs) {
	const formData = await request.formData();
	const userId = formData.get("userId");
	const amount = formData.get("amount");
	const note = formData.get("note");

	const baseURL = context.cloudflare.env.SHAMO_API_BASE_URL;

	const response = await fetch(`${baseURL}/rooms/${params.roomId}/payments`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ user_id: userId, amount, note }),
	});

	if (!response.ok) {
		return json(
			{
				error: `Error: ${((await response.json()) as ErrorResponseBody).error.code}`,
			},
			{ status: 500 },
		);
	}

	return redirect(`/rooms/${params.roomId}`);
}

export default function Page() {
	const rUsers = useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();

	return (
		<>
			<h3>Add a payment</h3>
			{actionData?.error && <p className="text-red-500">{actionData.error}</p>}
			<Form method="post">
				<label>
					User:
					<select name="userId">
						{rUsers.map((rUser) => (
							<option key={rUser.userId} value={rUser.userId}>
								{rUser.name}
							</option>
						))}
					</select>
				</label>
				<label>
					Amount:
					<input type="number" name="amount" required />
				</label>
				<label>
					Note:
					<input type="text" name="note" />
				</label>
				<button type="submit">Add</button>
			</Form>
			<h3>Users</h3>
			<ul>
				{rUsers.map((rUser) => (
					<li key={rUser.userId}>
						<img
							src={rUser.iconUrl}
							alt={rUser.name}
							className="w-12 h-12 rounded-full"
						/>
						<div>
							<p className="font-bold">{rUser.name}</p>
							<p>Total: {rUser.paymentsTotalAmount}</p>
						</div>
					</li>
				))}
			</ul>
		</>
	);
}
