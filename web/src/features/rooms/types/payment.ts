export type PaymentsResponse = {
  id: string;
  price: number;
  room_id: string;
  user_id: string;
  what: string;
  created_at: string;
}[];

export type Payment = {
  id: string;
  amount: number;
  roomId: string;
  userId: string;
  note: string;
  createdAt: string;
};
