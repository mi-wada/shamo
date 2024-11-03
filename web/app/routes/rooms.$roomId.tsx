// Layout under /rooms/:roomId

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json, Outlet, useLoaderData } from "@remix-run/react";
import { Home } from "~/component/icon/home";
import { Time } from "~/component/icon/time";

export const meta: MetaFunction<typeof loader> = ({ data: room }) => {
	return [{ title: room ? `Shamo / ${room.emoji}${room.name}` : "Shamo" }];
};

type Room = {
	id: string;
	name: string;
	emoji: string;
};

type RoomResponseBody = {
	id: string;
	name: string;
	emoji: string;
};

export async function loader({ params, context }: LoaderFunctionArgs) {
	const baseUrl = context.cloudflare.env.SHAMO_API_BASE_URL;
	const roomResponse = await context.cloudflare.env.API.fetch(
		`${baseUrl}/rooms/${params.roomId}`,
	);
	if (roomResponse.status === 404) {
		throw json("Room not found", { status: 404 });
	}
	if (!roomResponse.ok) {
		console.log(roomResponse);
		throw new Error("Failed to fetch room data");
	}
	const roomResponseBody: RoomResponseBody = await roomResponse.json();

	const room: Room = {
		id: roomResponseBody.id,
		name: roomResponseBody.name,
		emoji: roomResponseBody.emoji,
	};
	return json(room);
}

export default function Layout() {
	const room = useLoaderData<typeof loader>();

	return (
		<>
			<h2>{`${room.emoji} ${room.name}`}</h2>
			<nav>
				<ul>
					<li>
						<a href={`/rooms/${room.id}`}>
							<Home alt="Home" className="size-6" />
						</a>
					</li>
					<li>
						<a href={`/rooms/${room.id}/history`}>
							<Time alt="History" className="size-6" />
						</a>
					</li>
				</ul>
			</nav>
			<Outlet />
		</>
	);
}
