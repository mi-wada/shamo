import { useEffect, useState } from "react";
import { Payment } from "../types/payment";

export const useDeletePayment = ({ callback }: { callback: () => Promise<void> }) => {
  const [loading, setLoading] = useState(false);

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
    await callback();
  };

  return { loading, deletePayment };
};
