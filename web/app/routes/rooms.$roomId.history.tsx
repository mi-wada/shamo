import type {
	LoaderFunctionArgs,
	MetaFunction,
	ActionFunction,
} from "@remix-run/cloudflare";
import { json, useLoaderData, redirect } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { getRoomUsers } from "~/shamo_api/client";
import { rfc3339ToSimpleFormat } from "~/utils";

type Payment = {
	id: string;
	userName: string;
	roomId: string;
	amount: number;
	note: string;
	createdAt: string;
};

type PaymentResponseBoby = {
	id: string;
	user_id: string;
	room_id: string;
	amount: number;
	note: string;
	created_at: string;
};

export async function loader({ params, context }: LoaderFunctionArgs) {
	const baseURL = context.cloudflare.env.SHAMO_API_BASE_URL;

	const paymentsResponse = await fetch(
		`${baseURL}/rooms/${params.roomId}/payments`,
	);
	if (!paymentsResponse.ok) {
		console.log(paymentsResponse);
		throw new Error("Failed to fetch payments data");
	}
	const paymentsResponseBody: Array<PaymentResponseBoby> =
		await paymentsResponse.json();

	const roomUsersResponseBody = await getRoomUsers(
		context.cloudflare.env.SHAMO_API_BASE_URL,
		params.roomId as string,
	);

	const payments: Array<Payment> = paymentsResponseBody.map((payment) => ({
		id: payment.id,
		userName:
			roomUsersResponseBody.find((ru) => ru.user_id === payment.user_id)
				?.name ?? "Unknown",
		roomId: payment.room_id,
		amount: payment.amount,
		note: payment.note,
		createdAt: rfc3339ToSimpleFormat(payment.created_at),
	}));

	return json(payments);
}

export async function action({ request, params, context }: LoaderFunctionArgs) {
	const formData = await request.formData();
	const paymentId = formData.get("paymentId");

	if (typeof paymentId !== "string") {
		throw new Error("Invalid payment ID");
	}

	const baseURL = context.cloudflare.env.SHAMO_API_BASE_URL;

	const response = await fetch(
		`${baseURL}/rooms/${params.roomId}/payments/${paymentId}`,
		{
			method: "DELETE",
		},
	);

	if (!response.ok) {
		throw new Error("Failed to delete payment");
	}

	return redirect(`/rooms/${params.roomId}/history`);
}

export default function Page() {
	const payments = useLoaderData<typeof loader>();

	return (
		<table>
			<thead>
				<tr>
					<th>User Name</th>
					<th>Amount</th>
					<th>Note</th>
					<th>Created At</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{payments.map((payment) => (
					<tr key={payment.id}>
						<td>{payment.userName}</td>
						<td>{payment.amount}</td>
						<td>{payment.note}</td>
						<td>{payment.createdAt}</td>
						<td>
							<Form method="post">
								<input type="hidden" name="paymentId" value={payment.id} />
								<button type="submit">Delete</button>
							</Form>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
