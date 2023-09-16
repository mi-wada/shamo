import { Box, Card, CardContent } from "@mui/material";
import { User } from "../../types/user";
import { UserCard } from "./UserCard";

type UserCardsProps = {
  users: User[];
};

export const UserCards = ({ users }: UserCardsProps) => (
  <Box sx={{ display: "flex", justifyContent: "center", gap: "16px", margin: "24px" }}>
    {users.map((user) => (
      <UserCard
        key={user.id}
        name={user.name}
        totalPrice={user.payments.map((p) => p.price).reduce((acc, cur) => acc + cur, 0)}
      />
    ))}
  </Box>
);
