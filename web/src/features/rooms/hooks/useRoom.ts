import { useQuery } from "@/hooks/useQuery";

import { Member, Room } from "../types/room";

type RoomResponse = {
  id: string;
  name: string;
  created_by: string;
  members: {
    id: string;
    room_id: string;
    user: {
      id: string;
      name: string;
      icon_url: string;
    };
    total_amount: number;
  }[];
};

export const useRoom = ({ roomId }: { roomId: string }) => {
  const { data, ...rest } = useQuery<RoomResponse, ShamoApiErrorResponse>({
    url: `${process.env.NEXT_PUBLIC_SHAMO_API_BASE_URL}/rooms/${roomId}`,
  });

  return {
    data: {
      id: data?.id,
      name: data?.name,
      members: data?.members.map((member) => ({
        id: member.id,
        roomId: member.room_id,
        user: {
          id: member.user.id,
          name: member.user.name,
          iconUrl: member.user.icon_url,
        },
        totalAmount: member.total_amount,
      })) as Member[],
    } as Room,
    ...rest,
  };
};
