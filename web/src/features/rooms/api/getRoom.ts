import { jsonToRoom } from "../types/room";

type GetRoomsProps = {
  roomId: string;
};

export const getRooms = async ({ roomId }: GetRoomsProps) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SHAMO_API_BASE_URL}/rooms/${roomId}`);
  const data = await res.json();

  return jsonToRoom(data);
};
