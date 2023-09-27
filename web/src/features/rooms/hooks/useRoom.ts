import { useQuery } from "@/hooks/useQuery";

import { RoomResponse, jsonToRoom } from "../types/room";

type UseRoomsProps = {
  roomId: string;
};

export const useRoom = ({ roomId }: UseRoomsProps) => {
  const { data, ...rest } = useQuery<RoomResponse, ShamoApiErrorResponse>({
    url: `${process.env.NEXT_PUBLIC_SHAMO_API_BASE_URL}/rooms/${roomId}`,
  });

  return {
    data: data && jsonToRoom(data),
    ...rest,
  };
};
