import { Payment } from "./payment";

export type User = {
  id: string;
  name: string;
  email: string;
  picture_url: string;
  room_id: string;
  payments: Payment[];
};
