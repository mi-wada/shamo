"use client";
import { Table, TableContainer, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

import { IconButton } from "@/components/common/IconButton";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useSnackbar } from "@/components/common/Snackbar/hooks";
import { useRoom } from "@/features/rooms";

import { useDeletePayment } from "../../hooks/useDeletePayment";
import { usePayments } from "../../hooks/usePayments";

type PaymentHistoryProps = {
  roomId: string;
};

export const PaymentHistory = ({ roomId }: PaymentHistoryProps) => {
  const {
    data: payments,
    loading: paymentsLoading,
    error: paymentsError,
    refetch: refetchPayments,
  } = usePayments({ roomId });
  const {
    data: room,
    loading: roomLoading,
    error: roomError,
    refetch: refetchRoom,
  } = useRoom({ roomId });

  const { showSnackbar } = useSnackbar();

  const { loading: deleteLoading, mutate: deletePayment } = useDeletePayment({
    onSuccess: async () => {
      showSnackbar({ message: "Deleted", success: true });
      await refetchPayments();
      await refetchRoom();
    },
  });

  const handleDelete = (id: string) => async () => {
    await deletePayment({ roomId, paymentId: id });
  };

  if (paymentsLoading || roomLoading || !payments || !room) {
    return <LoadingScreen />;
  }

  if (paymentsError || roomError) {
    // TODO: ちゃんとやる
    return <div>Error</div>;
  }

  return (
    <TableContainer>
      <Table stickyHeader size="small" sx={{ minWidth: 350, maxHeight: "100vh" }}>
        <TableHead>
          <TableRow>
            <TableCell>Amount</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Note</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>
                {room.members.find((m) => m.id === payment.memberId)?.user.name}
              </TableCell>
              <TableCell>{payment.note}</TableCell>
              <TableCell>
                <IconButton
                  iconType="delete"
                  size="medium"
                  onClick={handleDelete(payment.id)}
                  disabled={deleteLoading}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
