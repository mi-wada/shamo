import { type FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Money } from "./component/icon/Money";
import { Next } from "./component/icon/Next";
import { Note } from "./component/icon/Note";
import { Previous } from "./component/icon/Previous";
import { Time } from "./component/icon/Time";
import { Trash } from "./component/icon/Trash";
import { User } from "./component/icon/User";
import { LinkButton } from "./component/LinkButton";
import { friendyCurrency } from "./utils";

export default function RoomHistory() {
	// const { roomId } = useParams();
	type Payment = {
		id: string;
		userName: string;
		roomId: string;
		amount: number;
		note: string;
		createdAt: string;
	};
	const payments: Payment[] = [
		{
			id: "p-1",
			userName: "Mitsuaki",
			roomId: "r",
			amount: 100,
			note: "hoge",
			createdAt: "2025-11-27 22:08:14",
		},
		{
			id: "p-2",
			userName: "Kahori",
			roomId: "r",
			amount: 100,
			note: "hoge",
			createdAt: "2025-11-27 22:08:14",
		},
	];

	const { search } = useLocation();
	const currentPage = Number.parseInt(
		new URLSearchParams(search).get("page") ?? "1",
		10,
	);

	const [submitting, SetSubmitting] = useState(false);
	const navigate = useNavigate();

	const handleDeletePayment = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		SetSubmitting(true);
		// TODO: implement
		navigate(0);
	};

	return (
		<>
			<div className="flex gap-2">
				<LinkButton
					to={`?page=${currentPage - 1}`}
					disabled={currentPage <= 1}
					className="flex-1"
				>
					<Previous alt="Previous page" className="size-5" />
				</LinkButton>
				<LinkButton
					to={`?page=${currentPage + 1}`}
					// TODO: implement this
					disabled={false}
					className="flex-1"
				>
					<Next alt="Next page" className="size-5" />
				</LinkButton>
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
								<Time alt="Payment added time" className="size-5" />
							</th>
							<th />
						</tr>
					</thead>
					<tbody>
						{payments.map((payment) => (
							<tr key={payment.id}>
								<td>{payment.userName}</td>
								<td>{friendyCurrency(payment.amount)}</td>
								<td>{payment.note}</td>
								<td>{payment.createdAt}</td>
								<td>
									<form onSubmit={handleDeletePayment}>
										<input type="hidden" name="paymentId" value={payment.id} />
										<button type="submit" disabled={submitting}>
											<Trash
												alt="Delete a payment"
												className="size-5 text-danger"
											/>
										</button>
									</form>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}
