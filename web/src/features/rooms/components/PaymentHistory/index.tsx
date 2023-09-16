"use client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect } from "react";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { IconButton } from "@/components/common/IconButton";

type Payment = {
  id: string;
  price: number;
  room_id: string;
  user_id: string;
  what: string;
  created_at: string;
};

const usePayments = (roomId: string) => {
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchPayments = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SHAMO_API_BASE_URL}/rooms/${roomId}/payments`,
    );
    const data = await res.json();
    setPayments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, [roomId]);

  const refetch = async () => {
    setLoading(true);
    fetchPayments();
  };

  return { payments, loading, refetch };
};

const useDeletePayment = ({ refetch }: { refetch: () => Promise<void> }) => {
  const [loading, setLoading] = React.useState(false);

  const deletePayment = async (roomId: string, paymentId: string) => {
    setLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_SHAMO_API_BASE_URL}/rooms/${roomId}/payments`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: paymentId,
      }),
    });
    setLoading(false);
    await refetch();
  };

  return { loading, deletePayment };
};

type PaymentHistoryProps = {
  roomId: string;
};

export const PaymentHistory = ({ roomId }: PaymentHistoryProps) => {
  const { payments, loading, refetch } = usePayments(roomId);

  const { loading: deleteLoading, deletePayment } = useDeletePayment({ refetch });

  const handleDelete = (id: string) => async () => {
    await deletePayment(roomId, id);
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <TableContainer>
      <Table stickyHeader sx={{ minWidth: 350 }}>
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
