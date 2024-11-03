import { Box } from "@mui/material";

import { PaymentHistory } from "../PaymentHistory";

type HistoryScreenProps = {
  roomId: string;
};

export const HistoryScreen = ({ roomId }: HistoryScreenProps) => {
  return (
    <Box sx={{ margin: "8px" }}>
      <PaymentHistory roomId={roomId} />
    </Box>
  );
};
