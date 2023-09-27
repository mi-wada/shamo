"use client";
import { Add } from "@mui/icons-material";
import { Box, Drawer, Fab } from "@mui/material";
import { useState } from "react";

import { LoadingScreen } from "@/components/common/LoadingScreen";

import { usePayments } from "../../hooks/usePayments";
import { useRoom } from "../../hooks/useRoom";
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
  const {
    data: payments,
    loading: paymentsLoading,
    error: paymentsError,
    refetch: paymentsRefetch,
  } = usePayments({ roomId });
  const { data: room, error: roomError, loading: roomLoading } = useRoom({ roomId });

  const [open, setOpen] = useState(false);

  const [defaultPaiedBy, setDefaultPaiedBy] = useState<string | undefined>(undefined);

  const afterSubmit = async () => {
    setOpen(false);
    await paymentsRefetch();
  };

  if (paymentsLoading || roomLoading) {
    return <LoadingScreen />;
  }

  if (paymentsError || roomError) {
    // TODO: ちゃんとやる
    return <div>Error</div>;
  }

  return (
    <Box>
      <UserCards
        members={room.members}
        cardOnClick={(member) => () => {
          setDefaultPaiedBy(member.id);
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
          members={room.members}
          afterSubmit={afterSubmit}
          defaultPaiedBy={defaultPaiedBy}
        />
      </Drawer>
    </Box>
  );
};
