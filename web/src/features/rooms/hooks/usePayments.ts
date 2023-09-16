import { useEffect, useState } from "react";
import { Payment } from "../types/payment";

export const usePayments = (roomId: string) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

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
