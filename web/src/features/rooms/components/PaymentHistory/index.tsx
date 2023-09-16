"use client";
import { Table, TableContainer, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { IconButton } from "@/components/common/IconButton";
import { usePayments } from "../../hooks/usePayments";
import { useDeletePayment } from "../../hooks/useDeletePayment";

type PaymentHistoryProps = {
  roomId: string;
};

export const PaymentHistory = ({ roomId }: PaymentHistoryProps) => {
  const { payments, loading: paymentsLoading, refetch } = usePayments(roomId);

  const { loading: deleteLoading, deletePayment } = useDeletePayment({ callback: refetch });

  const handleDelete = (id: string) => async () => {
    await deletePayment(roomId, id);
  };

  return paymentsLoading ? (
    <LoadingScreen />
  ) : (
    <TableContainer>
      <Table stickyHeader sx={{ minWidth: 350, maxHeight: "100vh" }}>
        <TableHead>
          <TableRow>
            <TableCell>Price</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Memo</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.price}</TableCell>
              <TableCell>{payment.user_id}</TableCell>
              <TableCell>{payment.what}</TableCell>
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
