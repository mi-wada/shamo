"use client";
import { Add } from "@mui/icons-material";
import { Box, Drawer, Fab } from "@mui/material";
import { useState } from "react";

import { LoadingScreen } from "@/components/common/LoadingScreen";

import { usePayments } from "../../hooks/usePayments";
import { useUsers } from "../../hooks/useUsers";
import { AddingPaymentForm } from "../AddingPaymentForm";
import { UserCards } from "../UserCards";

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

  const [defaultPaiedBy, setDefaultPaiedBy] = useState<string | undefined>(undefined);

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
      <UserCards
        users={users}
        cardOnClick={(user) => () => {
          setDefaultPaiedBy(user.id);
          setOpen(true);
        }}
      />
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
        <AddingPaymentForm
          roomId={roomId}
          users={users}
          afterSubmit={afterSubmit}
          defaultPaiedBy={defaultPaiedBy}
        />
      </Drawer>
    </Box>
  );
};
