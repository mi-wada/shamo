import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, redirect, Await, defer } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { Suspense } from "react";
import { getRoomPayments, getRoomUsers } from "~/shamo_api/client";
import { rfc3339ToSimpleFormat } from "~/utils";

type Payment = {
	id: string;
	userName: string;
	roomId: string;
	amount: number;
	note: string;
	createdAt: string;
};

async function getPayments(
	baseUrl: string,
	fetcher: Fetcher,
	roomId: string,
): Promise<Array<Payment>> {
	const paymentsResponseBody = await getRoomPayments(baseUrl, fetcher, roomId);
	const roomUsersResponseBody = await getRoomUsers(baseUrl, fetcher, roomId);

	return paymentsResponseBody.map((payment) => ({
		id: payment.id,
		userName:
			roomUsersResponseBody.find((ru) => ru.user_id === payment.user_id)
				?.name ?? "Unknown",
		roomId: payment.room_id,
		amount: payment.amount,
		note: payment.note,
		createdAt: rfc3339ToSimpleFormat(payment.created_at),
	}));
}

export async function loader({ params, context }: LoaderFunctionArgs) {
	const baseUrl = context.cloudflare.env.SHAMO_API_BASE_URL;
	const payments = await getPayments(
		baseUrl,
		context.cloudflare.env.API,
		params.roomId as string,
	);

	return { payments };
}

export async function action({ request, params, context }: LoaderFunctionArgs) {
	const formData = await request.formData();
	const paymentId = formData.get("paymentId");

	if (typeof paymentId !== "string") {
		throw new Error("Invalid payment ID");
	}

	const baseUrl = context.cloudflare.env.SHAMO_API_BASE_URL;
	const fetcher = context.cloudflare.env.API;

	const response = await fetcher.fetch(
		`${baseUrl}/rooms/${params.roomId}/payments/${paymentId}`,
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
	const { payments } = useLoaderData<typeof loader>();

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
