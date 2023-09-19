import { Payment } from "./payment";

export type UsersResponse = {
  id: string;
  name: string;
  email: string;
  picture_url: string;
  room_id: string;
}[];

export type User = {
  id: string;
  name: string;
  email: string;
  pictureUrl: string;
  roomId: string;
  payments: Payment[];
};
