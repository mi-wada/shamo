import { useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router";
import { Home } from "./component/icon/Home";
import { Time } from "./component/icon/Time";
import { ThemeToggleButton } from "./component/ThemeToggleButton";
import { getRoom } from "./shamoapi";
import type { Room } from "./type";

export default function RoomLayout() {
	const { roomId } = useParams();
	const [room, setRoom] = useState<Room | undefined>(undefined);

	useEffect(() => {
		if (!roomId) {
			return;
		}

		getRoom(roomId)
			.then(setRoom)
			.catch((error) => {
				console.error("Failed to load room", error);
			});
	}, [roomId]);

	return (
		<>
			<header className="flex items-center justify-between gap-4 flex-wrap">
				<h1 className="text-h1 font-bold ml-2">
					Shamo / {room === undefined ? "" : `${room?.emoji} ${room?.name}`}
				</h1>
				<div className="ml-auto">
					<ThemeToggleButton />
				</div>
			</header>
			<nav className="tabs tabs-border w-full">
				<NavLink
					to={`/rooms/${roomId}`}
					end
					className={({ isActive }) =>
						isActive ? "flex-1 tab tab-active" : "flex-1 tab"
					}
				>
					<Home alt="Home" className="size-6" />
				</NavLink>
				<NavLink
					to={`/rooms/${roomId}/history`}
					className={({ isActive }) =>
						isActive ? "flex-1 tab tab-active" : "flex-1 tab"
					}
				>
					<Time alt="Home" className="size-6" />
				</NavLink>
			</nav>
			<div className="m-4">
				<Outlet />
			</div>
		</>
	);
}
