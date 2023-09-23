"use client";
import { Table, TableContainer, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

import { IconButton } from "@/components/common/IconButton";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useSnackbar } from "@/components/common/Snackbar/hooks";

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
    refetch,
  } = usePayments({ roomId });
  const { showSnackbar } = useSnackbar();

  const { loading: deleteLoading, mutate: deletePayment } = useDeletePayment({
    onSuccess: async () => {
      showSnackbar({ message: "Deleted", success: true });
      await refetch();
    },
  });

  const handleDelete = (id: string) => async () => {
    await deletePayment({ roomId, paymentId: id });
  };

  if (paymentsLoading) {
    return <LoadingScreen />;
  }

  if (paymentsError) {
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
            <TableCell>Memo</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>{payment.memberId}</TableCell>
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
