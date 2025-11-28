import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./main.css";
import Room from "./Room.tsx";
import RoomHistory from "./RoomHistory.tsx";
import RoomLayout from "./RoomLayout.tsx";
import { ThemeProvider } from "./ThemeProvider";

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed to exist
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider>
			<BrowserRouter>
				<Routes>
					<Route path="rooms/:roomId" element={<RoomLayout />}>
						<Route index element={<Room />}></Route>
						<Route path="history" element={<RoomHistory />}></Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>,
);
