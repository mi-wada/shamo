import type {
	ActionFunctionArgs,
	LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Money } from "~/component/icon/money";
import { Note } from "~/component/icon/note";
import { User } from "~/component/icon/user";
import { type ErrorResponseBody, getRoomUsers } from "~/shamo_api/client";
import { toFriendyCurrency } from "~/utils";

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

	return roomUsers;
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
		const errorResponseBody: ErrorResponseBody = await response.json();
		return {
			error: `Error: ${errorResponseBody.error.code}`,
		};
	}

	return redirect(`/rooms/${params.roomId}`);
}

export default function Page() {
	const rUsers = useLoaderData<typeof loader>();

	const submitError = useActionData<typeof action>()?.error;

	const navigation = useNavigation();
	const submitting = navigation.state === "submitting";

	// Reset the form after submitting
	// https://ahmadrosid.com/cheatsheet/remix/remix-reset-form-submit
	const formRef = useRef<HTMLFormElement>(null);
	useEffect(() => {
		if (!submitting) {
			formRef.current?.reset();
		}
	}, [submitting]);

	return (
		<>
			<div className="card card-compact shadow-xl my-4">
				<div className="card-body">
					{submitError && <p className="text-danger">{submitError}</p>}
					<Form method="post" ref={formRef}>
						<label className="input flex items-center my-2">
							<User className="h-4 w-4 opacity-70" alt="User" />
							<select
								name="userId"
								defaultValue={rUsers[0].userId}
								className="select grow"
								required
							>
								{rUsers.map((rUser) => (
									<option key={rUser.userId} value={rUser.userId}>
										{rUser.name}
									</option>
								))}
							</select>
						</label>
						<label className="input flex items-center gap-2 my-2">
							<Money className="h-4 w-4 opacity-70" alt="Amount" />
							<input
								type="number"
								name="amount"
								required
								placeholder="Amount"
								className="grow"
							/>
						</label>
						<label className="input flex items-center gap-2 my-2">
							<Note className="h-4 w-4 opacity-70" alt="Note" />
							<input type="text" name="note" placeholder="Note" />
						</label>
						<div className="flex justify-end">
							<button
								className="btn btn-primary btn-sm lg:btn-md"
								type="submit"
								disabled={submitting}
							>
								Add
							</button>
						</div>
					</Form>
				</div>
			</div>
			<div className="flex justify-center space-x-4 my-4">
				{rUsers.map((rUser) => (
					<div key={rUser.userId} className="card p-2 w-36 shadow-xl">
						<div className="flex items-center space-x-2 mb-4">
							<img
								src={rUser.iconUrl}
								alt={rUser.name}
								className="w-6 h-6 rounded-full"
							/>
							<p className="font-bold">{rUser.name}</p>
						</div>
						<div className="text-center">
							<p className="font-bold">
								{toFriendyCurrency(rUser.paymentsTotalAmount)}
							</p>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
