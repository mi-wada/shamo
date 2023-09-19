import { Box } from "@mui/material";

import { User } from "../../types/user";

import { UserCard } from "./UserCard";

type UserCardsProps = {
  users: User[];
  cardOnClick: (user: User) => () => void;
};

export const UserCards = ({ users, cardOnClick }: UserCardsProps) => (
  <Box sx={{ display: "flex", justifyContent: "center", gap: "16px", margin: "24px" }}>
    {users.map((user) => (
      <UserCard
        key={user.id}
        user={user}
        totalPrice={user.payments.map((p) => p.amount).reduce((acc, cur) => acc + cur, 0)}
        onClick={cardOnClick}
      />
    ))}
  </Box>
);
