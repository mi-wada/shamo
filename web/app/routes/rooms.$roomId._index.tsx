import type {
	LoaderFunctionArgs,
	ActionFunctionArgs,
} from "@remix-run/cloudflare";
import { json, useLoaderData, redirect, useNavigation } from "@remix-run/react";
import { Form, useActionData } from "@remix-run/react";
import { Money } from "~/component/icon/money";
import { Note } from "~/component/icon/note";
import { User } from "~/component/icon/user";
import { type ErrorResponseBody, getRoomUsers } from "~/shamo_api/client";

type RoomUser = {
	userId: string;
	name: string;
	paymentsTotalAmount: number;
	iconUrl: string;
};

export async function loader({ params, context }: LoaderFunctionArgs) {
	const baseUrl = context.cloudflare.env.SHAMO_API_BASE_URL;
	const roomUsersResponseBody = await getRoomUsers(
		baseUrl,
		context.cloudflare.env.API,
		params.roomId as string,
	);

	const roomUsers: Array<RoomUser> = roomUsersResponseBody.map((ru) => ({
		userId: ru.user_id,
		name: ru.name,
		paymentsTotalAmount: ru.payments_total_amount,
		iconUrl: ru.icon_url,
	}));

	return json(roomUsers);
}

export async function action({ request, params, context }: ActionFunctionArgs) {
	const formData = await request.formData();
	const userId = formData.get("userId");
	const amount = formData.get("amount");
	const note = formData.get("note");

	const baseUrl = context.cloudflare.env.SHAMO_API_BASE_URL;
	const response = await context.cloudflare.env.API.fetch(
		`${baseUrl}/rooms/${params.roomId}/payments`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user_id: userId, amount, note }),
		},
	);

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

	const navigation = useNavigation();
	const submitting = navigation.state === "submitting";

	return (
		<>
			<div className="card card-compact bg-base-300 shadow-xl my-4">
				<div className="card-body">
					<h2 className="card-title text-h2 font-bold">Add a payment</h2>
					{actionData?.error && (
						<p className="text-danger">{actionData.error}</p>
					)}
					<Form method="post">
						<label className="input flex items-center my-4">
							<User className="h-4 w-4 opacity-70" alt="User" />
							<select name="userId" className="select w-full">
								<option disabled selected>
									Select a paid user
								</option>
								{rUsers.map((rUser) => (
									<option key={rUser.userId} value={rUser.userId}>
										{rUser.name}
									</option>
								))}
							</select>
						</label>
						<label className="input flex items-center gap-2 my-4">
							<Money className="h-4 w-4 opacity-70" alt="Amount" />
							<input
								type="number"
								name="amount"
								required
								placeholder="Amount"
								className="grow"
							/>
						</label>
						<label className="input flex items-center gap-2 my-4">
							<Note className="h-4 w-4 opacity-70" alt="Note" />
							<input
								type="text"
								name="note"
								placeholder="Note"
								className="grow"
							/>
						</label>
						<div className="flex justify-end">
							<button
								className="btn btn-primary"
								type="submit"
								disabled={submitting}
							>
								Add
							</button>
						</div>
					</Form>
				</div>
			</div>
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
