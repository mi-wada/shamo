"use client";
import { Box, Input, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { User } from "../../types/user";
import { Button } from "@/components/common/Button";
import { useState } from "react";

const usePostPayment = () => {
  const [loading, setLoading] = useState(false);

  const postPayment = async (roomId: string, price: number, PaiedBy: string, note: string) => {
    setLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_SHAMO_API_BASE_URL}/rooms/${roomId}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price: price,
        user_id: PaiedBy,
        what: note,
      }),
    });
    setLoading(false);
  };

  return { loading, postPayment };
};

export const AddingPaymentForm = ({
  roomId,
  users,
  afterSubmit,
  defaultPaiedBy,
}: {
  roomId: string;
  users: User[];
  afterSubmit: () => Promise<void>;
  defaultPaiedBy?: string;
}) => {
  const [price, setPrice] = useState<number | undefined>(undefined);
  const onChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value === "" ? undefined : Number(event.target.value));
  };
  const [paiedBy, setPaiedBy] = useState<string>(defaultPaiedBy || users[0]?.id);
  const onChangePaiedBy = (event: SelectChangeEvent) => {
    setPaiedBy(event.target.value);
  };
  const [note, setNote] = useState<string>("");
  const onChangeNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };

  const { loading, postPayment } = usePostPayment();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: validation by zod
    await postPayment(roomId, price as number, paiedBy, note);
    setPrice(undefined);
    setPaiedBy(users[0]?.id);
    setNote("");
    await afterSubmit();
    // TODO: show toast
  };

  return (
    <Box component="form" sx={{ margin: "8px" }} onSubmit={onSubmit}>
      <Box sx={{ margin: "8px", display: "block" }}>
        <Typography variant="caption" component="label" htmlFor="price">
          Price
        </Typography>
        <Input
          type="number"
          id="price"
          value={price === undefined ? "" : price}
          onChange={onChangePrice}
          required
          placeholder="500"
          sx={{ width: "100%" }}
        />
      </Box>
      <Box sx={{ margin: "8px", display: "block" }}>
        <Typography variant="caption" component="label" htmlFor="paied_by">
          Paied By
        </Typography>
        <Select
          id="paied_by"
          value={paiedBy}
          onChange={onChangePaiedBy}
          required
          sx={{ width: "100%", height: "40px" }}
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ margin: "8px", display: "block" }}>
        <Typography variant="caption" component="label" htmlFor="note">
          Note
        </Typography>
        <Input
          type="text"
          id="note"
          value={note}
          onChange={onChangeNote}
          placeholder="coffee☕"
          sx={{ width: "100%" }}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "right", margin: "8px" }}>
        <Button type="submit" color="primary" loading={loading}>
          Add
        </Button>
      </Box>
    </Box>
  );
};
