"use client";
import { Box } from "@mui/material";
import { UserCards } from "../UserCards";
import { usePayments } from "../../hooks/usePayments";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useUsers } from "../../hooks/useUsers";

type HomeScreenProps = {
  roomId: string;
};

export const HomeScreen = ({ roomId }: HomeScreenProps) => {
  const { payments, loading: paymentsLoading } = usePayments(roomId);
  const { users, loading: usersLoading } = useUsers(roomId);

  users.forEach((user) => {
    user.payments = payments.filter((payment) => payment.user_id === user.id);
  });

  return paymentsLoading || usersLoading ? (
    <LoadingScreen />
  ) : (
    <Box sx={{ margin: "8px" }}>
      <UserCards users={users} />
    </Box>
  );
};
