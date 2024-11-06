import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { redirect, useLoaderData, useLocation } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { Money } from "~/component/icon/money";
import { Next } from "~/component/icon/next";
import { Note } from "~/component/icon/note";
import { Previous } from "~/component/icon/previous";
import { Time } from "~/component/icon/time";
import { Trash } from "~/component/icon/trash";
import { User } from "~/component/icon/user";
import { LinkButton } from "~/component/link_button";
import { getRoomPayments, getRoomUsers } from "~/shamo_api/client";
import { rfc3339ToSimpleFormat, toFriendyCurrency } from "~/utils";

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
	page: number,
): Promise<Array<Payment>> {
	const paymentsResponseBody = await getRoomPayments(
		baseUrl,
		fetcher,
		roomId,
		page,
	);
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

export async function loader({ params, context, request }: LoaderFunctionArgs) {
	const baseUrl = context.cloudflare.env.SHAMO_API_BASE_URL;
	const url = new URL(request.url);
	const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
	const payments = await getPayments(
		baseUrl,
		context.cloudflare.env.API,
		params.roomId as string,
		page,
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

	const { search } = useLocation();
	const currentPage = Number.parseInt(
		new URLSearchParams(search).get("page") ?? "1",
		10,
	);

	return (
		<>
			<div className="join grid grid-cols-2">
				<div className="join-item m-2">
					<LinkButton
						href={`?page=${currentPage - 1}`}
						disabled={currentPage <= 1}
					>
						<Previous alt="Previous page" className="size-5" />
					</LinkButton>
				</div>
				<div className="join-item m-2">
					<LinkButton
						href={`?page=${currentPage + 1}`}
						// TODO: implement this
						disabled={false}
					>
						<Next alt="Next page" className="size-5" />
					</LinkButton>
				</div>
			</div>
			<div className="overflow-x-auto">
				<table className="table table-xs lg:table-lg">
					<thead>
						<tr>
							<th>
								<User alt="User's name" className="size-5" />
							</th>
							<th>
								<Money alt="Amount" className="size-5" />
							</th>
							<th>
								<Note alt="Note" className="size-5" />
							</th>
							<th>
								<Time alt="Payment registered time" className="size-5" />
							</th>
							<th />
						</tr>
					</thead>
					<tbody>
						{payments.map((payment) => (
							<tr key={payment.id}>
								<td>{payment.userName}</td>
								<td>{toFriendyCurrency(payment.amount)}</td>
								<td>{payment.note}</td>
								<td>{payment.createdAt}</td>
								<td>
									<Form method="post">
										<input type="hidden" name="paymentId" value={payment.id} />
										<button type="submit">
											<Trash alt="Delete" className="size-5 text-danger" />
										</button>
									</Form>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}
