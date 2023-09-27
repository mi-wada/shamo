import { User } from "./user";

export type Room = {
  id: string;
  name: string;
  emoji: string;
  // user_id
  createdBy: string;
  members: Member[];
};

export type RoomResponse = {
  id: string;
  name: string;
  emoji: string;
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

export const jsonToRoom = (json: RoomResponse): Room => {
  return {
    id: json.id,
    name: json.name,
    emoji: json.emoji,
    createdBy: json.created_by,
    members: json.members.map((member) => ({
      id: member.id,
      roomId: member.room_id,
      user: {
        id: member.user.id,
        name: member.user.name,
        iconUrl: member.user.icon_url,
      },
      totalAmount: member.total_amount,
    })) as Member[],
  };
};

export type Member = {
  id: string;
  roomId: string;
  user: User;
  totalAmount: number;
};
