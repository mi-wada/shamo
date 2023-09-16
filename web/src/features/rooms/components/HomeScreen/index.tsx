"use client";
import { Box, Fab, SwipeableDrawer } from "@mui/material";
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
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
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
      </SwipeableDrawer>
    </Box>
  );
};
