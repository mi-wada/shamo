import { useQuery } from "@/hooks/useQuery";

import { Payment, PaymentsResponse } from "../types/payment";

export const usePayments = ({ roomId }: { roomId: string }) => {
  const { data, ...rest } = useQuery<PaymentsResponse, ShamoApiErrorResponse>({
    url: `${process.env.NEXT_PUBLIC_SHAMO_API_BASE_URL}/rooms/${roomId}/payments`,
  });

  return {
    data: data?.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      roomId: payment.room_id,
      memberId: payment.room_member_id,
      note: payment.note,
      // createdAt: payment.created_at,
    })) as Payment[],
    ...rest,
  };
};
