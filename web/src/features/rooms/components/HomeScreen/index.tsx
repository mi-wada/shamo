"use client";
import { Box, Drawer, Fab } from "@mui/material";
import { UserCards } from "../UserCards";
import { usePayments } from "../../hooks/usePayments";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useUsers } from "../../hooks/useUsers";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { AddingPaymentForm } from "../AddingPaymentForm";

const RegisterPaymentButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Fab
      color="primary"
      sx={{ position: "fixed", bottom: "24px", right: "24px" }}
      size="large"
      onClick={onClick}
    >
      <Add />
    </Fab>
  );
};

type HomeScreenProps = {
  roomId: string;
};

export const HomeScreen = ({ roomId }: HomeScreenProps) => {
  const { payments, loading: paymentsLoading, refetch: paymentsRefetch } = usePayments(roomId);
  const { users, loading: usersLoading } = useUsers(roomId);

  const [open, setOpen] = useState(false);

  const afterSubmit = async () => {
    setOpen(false);
    await paymentsRefetch();
  };

  users.forEach((user) => {
    user.payments = payments.filter((payment) => payment.user_id === user.id);
  });

  return paymentsLoading || usersLoading ? (
    <LoadingScreen />
  ) : (
    <Box sx={{ margin: "8px" }}>
      <UserCards users={users} />
      <RegisterPaymentButton
        onClick={() => {
          setOpen(true);
        }}
      />
      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <AddingPaymentForm roomId={roomId} users={users} afterSubmit={afterSubmit} />
      </Drawer>
    </Box>
  );
};
