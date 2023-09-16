import { useState } from "react";

export const usePostPayment = ({ callback }: { callback: () => Promise<void> }) => {
  const [loading, setLoading] = useState(false);

  const postPayment = async (roomId: string, price: number, paiedBy: string, note: string) => {
    setLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_SHAMO_API_BASE_URL}/rooms/${roomId}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price: price,
        user_id: paiedBy,
        what: note,
      }),
    });
    setLoading(false);
    await callback();
  };

  return { loading, postPayment };
};
