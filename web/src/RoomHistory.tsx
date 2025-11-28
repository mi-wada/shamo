import { type FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Money } from "./component/icon/Money";
import { Next } from "./component/icon/Next";
import { Note } from "./component/icon/Note";
import { Previous } from "./component/icon/Previous";
import { Time } from "./component/icon/Time";
import { Trash } from "./component/icon/Trash";
import { User } from "./component/icon/User";
import { LinkButton } from "./component/LinkButton";
import { Loading } from "./component/Loading";
import { deletePayment, getPayments } from "./shamoapi";
import type { Payment } from "./type";
import { friendyCurrency } from "./utils";

export default function RoomHistory() {
	const { search } = useLocation();
	const currentPage = Number.parseInt(
		new URLSearchParams(search).get("page") ?? "1",
		10,
	);

	const [submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();

	const handleDeletePayment = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!roomId) return;

		const formData = new FormData(e.currentTarget);
		const paymentId = formData.get("paymentId")?.toString();

		if (!paymentId) return;

		setSubmitting(true);

		try {
			await deletePayment(roomId, paymentId);
			navigate(0);
		} finally {
			setSubmitting(false);
		}
	};

	const { roomId } = useParams();
	const [payments, setPayments] = useState<Payment[] | undefined>(undefined);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!roomId) {
			return;
		}

		getPayments(roomId, currentPage)
			.then(setPayments)
			.catch((error) => {
				console.error("Failed to load payments", error);
			})
			.finally(() => setLoading(false));
	}, [roomId, currentPage]);

	if (loading) return <Loading message="Loading payments..." />;
	if (!payments) return <>404</>;

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
										<button
											type="submit"
											disabled={submitting}
											className="btn btn-ghost btn-error"
										>
											<Trash alt="Delete a payment" className="size-5" />
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
