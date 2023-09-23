export type PaymentsResponse = {
  id: string;
  amount: number;
  room_id: string;
  member_id: string;
  note: string;
  // created_at: string;
}[];

export type Payment = {
  id: string;
  amount: number;
  roomId: string;
  memberId: string;
  note: string;
  // createdAt: string;
};
