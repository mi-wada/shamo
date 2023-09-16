"use client";
import { Box, Drawer, Fab, Input, MenuItem, Select, TextField, Typography } from "@mui/material";
import { UserCards } from "../UserCards";
import { usePayments } from "../../hooks/usePayments";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useUsers } from "../../hooks/useUsers";
import { Add, Note } from "@mui/icons-material";
import { useState } from "react";
import { Button } from "@/components/common/Button";

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
  const [open, setOpen] = useState(false);

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
        <Box
          component="form"
          sx={{
            margin: "8px",
          }}
        >
          <Box sx={{ margin: "8px", display: "block" }}>
            <Typography variant="caption" component="label" htmlFor="price">
              Price
            </Typography>
            <Input type="number" placeholder="500" id="price" sx={{ width: "100%" }} />
          </Box>
          <Box sx={{ margin: "8px", display: "block" }}>
            <Typography variant="caption" component="label" htmlFor="paied_by">
              Paied By
            </Typography>
            <Select id="paied_by" sx={{ width: "100%", height: "40px" }}>
              <MenuItem key="1" value="1">
                Mitsuaki
              </MenuItem>
              <MenuItem key="2" value="2">
                Kahori
              </MenuItem>
            </Select>
          </Box>
          <Box sx={{ margin: "8px", display: "block" }}>
            <Typography variant="caption" component="label" htmlFor="note">
              Note
            </Typography>
            <Input type="text" placeholder="coffee☕" id="note" sx={{ width: "100%" }} />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "right", margin: "8px" }}>
            <Button type="submit" color="primary">
              Add
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};
