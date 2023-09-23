import { useMutation } from "@/hooks/useMutation";

type MutateProps = {
  roomId: string;
  amount: number;
  paiedBy: string;
  note: string;
};

export const usePostPayment = ({ onSuccess }: { onSuccess: () => Promise<void> }) => {
  return useMutation<any, ShamoApiErrorResponse, MutateProps>({
    method: "POST",
    url: (props: MutateProps) =>
      `${process.env.NEXT_PUBLIC_SHAMO_API_BASE_URL}/rooms/${props.roomId}/payments`,
    body: (props: MutateProps) => ({
      amount: props.amount,
      paied_by: props.paiedBy,
      note: props.note,
    }),
    onSuccess: onSuccess,
  });
};
