import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json, useLoaderData } from "@remix-run/react";

type Payment = {
	id: string;
	userId: string;
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

	const payments: Array<Payment> = paymentsResponseBody.map((payment) => ({
		id: payment.id,
		userId: payment.user_id,
		roomId: payment.room_id,
		amount: payment.amount,
		note: payment.note,
		createdAt: payment.created_at,
	}));

	return json(payments);
}

export default function Page() {
	const payments = useLoaderData<typeof loader>();

	return (
		<table>
			<thead>
				<tr>
					<th>User ID</th>
					<th>Amount</th>
					<th>Note</th>
					<th>Created At</th>
				</tr>
			</thead>
			<tbody>
				{payments.map((payment) => (
					<tr key={payment.id}>
						<td>{payment.userId}</td>
						<td>{payment.amount}</td>
						<td>{payment.note}</td>
						<td>{payment.createdAt}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
