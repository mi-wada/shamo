import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { Money } from "./component/icon/Money";
import { Note } from "./component/icon/Note";
import { User } from "./component/icon/User";
import { friendyCurrency } from "./utils";

export default function Room() {
	// const { roomId } = useParams();
	type RoomUser = {
		userId: string;
		name: string;
		paymentsTotalAmount: number;
		iconUrl: string;
	};
	const roomUsers: RoomUser[] = [
		{
			userId: "u-kahori",
			name: "Kahori",
			paymentsTotalAmount: 1000,
			iconUrl:
				"https://lh3.googleusercontent.com/a-/ALV-UjWjcjWgV7GpAO8x9mh4B2ryGRsmCxRGVlVvmvHgofq6Hpk=s128-p-k-rw-no",
		},
		{
			userId: "u-mitsuaki",
			name: "Mitsuaki",
			paymentsTotalAmount: 2000,
			iconUrl:
				"https://lh3.googleusercontent.com/a/ACg8ocLPV3xr7Eyo-hVtDdsCAaSMj37x_LOWAF-9dy5eyhT2EA=s80-p",
		},
	];

	const [submitting, SetSubmitting] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		SetSubmitting(true);
		// TODO: implement
		navigate(0);
	};

	return (
		<>
			<div className="card card-compact shadow-xl my-4">
				<div className="card-body">
					<form onSubmit={handleSubmit}>
						<label className="input input-ghost flex items-center gap-2 my-2 w-full">
							<User className="h-4 w-4 opacity-70" alt="User" />
							<select
								name="userId"
								defaultValue={roomUsers[0].userId}
								className="grow"
								required
							>
								{roomUsers.map((rUser) => (
									<option key={rUser.userId} value={rUser.userId}>
										{rUser.name}
									</option>
								))}
							</select>
						</label>
						<label className="input input-ghost flex items-center gap-2 my-2 w-full">
							<Money className="h-4 w-4 opacity-70" alt="Amount" />
							<input
								type="number"
								name="amount"
								required
								placeholder="Amount"
								className="grow"
							/>
						</label>
						<label className="input input-ghost flex items-center gap-2 my-2 w-full">
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
					</form>
				</div>
			</div>
			<div className="flex justify-center space-x-4 my-4">
				{roomUsers.map((rUser) => (
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
								{friendyCurrency(rUser.paymentsTotalAmount)}
							</p>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
