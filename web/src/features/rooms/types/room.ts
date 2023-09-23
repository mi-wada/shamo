export type Room = {
  id: string;
  name: string;
  // user_id
  createdBy: string;
  members: Member[];
};

export type Member = {
  id: string;
  roomId: string;
  userId: string;
  totalAmount: number;
};
