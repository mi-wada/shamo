"use client";
import { Box, MenuItem, type SelectChangeEvent } from "@mui/material";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { FormInputField, FormSelectField } from "@/components/common/FormField";

import { usePostPayment } from "../../hooks/usePostPayment";
import { User } from "../../types/user";

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
  const [paiedBy, setPaiedBy] = useState<string>(defaultPaiedBy || users[0]?.id);
  const onChangePaiedBy = (event: SelectChangeEvent<unknown>) => {
    setPaiedBy(event.target.value as string);
  };
  const [price, setPrice] = useState<number | undefined>(undefined);
  const onChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value === "" ? undefined : Number(event.target.value));
  };
  const [note, setNote] = useState<string>("");
  const onChangeNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };

  const { loading, postPayment } = usePostPayment({
    callback: async () => {
      const resetForm = () => {
        setPrice(undefined);
        setPaiedBy(users[0]?.id);
        setNote("");
      };
      resetForm();

      await afterSubmit();
    },
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: validation by zod
    await postPayment(roomId, price as number, paiedBy, note);
    // TODO: show toast
  };

  return (
    <Box component="form" sx={{ margin: "8px" }} onSubmit={onSubmit}>
      <FormSelectField
        id="paied_by"
        value={paiedBy}
        onChange={onChangePaiedBy}
        label="Paied By"
        required
      >
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.name}
          </MenuItem>
        ))}
      </FormSelectField>
      <FormInputField
        type="number"
        value={price === undefined ? "" : price}
        onChange={onChangePrice}
        placeholder="500"
        id="price"
        label="Price"
        required
      />
      <FormInputField
        type="text"
        value={note}
        onChange={onChangeNote}
        placeholder="coffee☕"
        id="note"
        label="Note"
      />
      <Box sx={{ display: "flex", justifyContent: "right", margin: "8px" }}>
        <Button type="submit" color="primary" loading={loading}>
          Add
        </Button>
      </Box>
    </Box>
  );
};
