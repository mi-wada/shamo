import { useMutation } from "@/hooks/useMutation";

type MutateProps = {
  roomId: string;
  paymentId: string;
};

export const useDeletePayment = ({ onSuccess }: { onSuccess: () => Promise<void> }) => {
  return useMutation<any, ShamoApiErrorResponse, MutateProps>({
    method: "DELETE",
    url: (props: MutateProps) =>
      `${process.env.NEXT_PUBLIC_SHAMO_API_BASE_URL}/rooms/${props.roomId}/payments/${props.paymentId}}`,
    onSuccess: onSuccess,
  });
};
