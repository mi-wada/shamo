import { useQuery } from "@/hooks/useQuery";

import { User, UsersResponse } from "../types/user";

export const useUsers = ({ roomId }: { roomId: string }) => {
  const { data, ...rest } = useQuery<UsersResponse, ShamoApiErrorResponse>({
    url: `${process.env.NEXT_PUBLIC_SHAMO_API_BASE_URL}/rooms/${roomId}/users`,
  });

  return {
    data: data?.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      pictureUrl: user.picture_url,
      roomId: user.room_id,
      payments: [],
    })) as User[],
    ...rest,
  };
};
