import { Box, Typography } from "@mui/material";

type HomeScreenProps = {
  roomId: string;
};

export const HomeScreen = ({ roomId }: HomeScreenProps) => {
  return (
    <Box sx={{ margin: "8px" }}>
      <Typography variant="h2">Home / {roomId}</Typography>
    </Box>
  );
};
