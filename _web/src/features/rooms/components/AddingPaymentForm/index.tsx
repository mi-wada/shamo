"use client";
import { Box, MenuItem, type SelectChangeEvent } from "@mui/material";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { FormInputField, FormSelectField } from "@/components/common/FormField";
import { useSnackbar } from "@/components/common/Snackbar/hooks";

import { usePostPayment } from "../../hooks/usePostPayment";
import { Member } from "../../types/room";

export const AddingPaymentForm = ({
  roomId,
  members,
  afterSubmit,
  defaultPaiedBy,
}: {
  roomId: string;
  members: Member[];
  afterSubmit: () => Promise<void>;
  defaultPaiedBy?: string;
}) => {
  const [paiedBy, setPaiedBy] = useState<string>(defaultPaiedBy || members[0]?.id);
  const onChangePaiedBy = (event: SelectChangeEvent<unknown>) => {
    setPaiedBy(event.target.value as string);
  };
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const onChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value === "" ? undefined : Number(event.target.value));
  };
  const [note, setNote] = useState<string>("");
  const onChangeNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };

  const { showSnackbar } = useSnackbar();

  const { loading, mutate: postPayment } = usePostPayment({
    onSuccess: async () => {
      const resetForm = () => {
        setAmount(undefined);
        setPaiedBy(members[0]?.id);
        setNote("");
      };
      resetForm();
      showSnackbar({ message: "Added", success: true });

      await afterSubmit();
    },
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: validation by zod
    await postPayment({ roomId, amount: amount as number, paiedBy, note });
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
        {members.map((member) => (
          <MenuItem key={member.id} value={member.id}>
            {member.user.name}
          </MenuItem>
        ))}
      </FormSelectField>
      <FormInputField
        type="number"
        value={amount === undefined ? "" : amount}
        onChange={onChangeAmount}
        placeholder="500"
        id="amount"
        label="Amount"
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
