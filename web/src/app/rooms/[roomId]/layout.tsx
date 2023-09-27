import { Box, Typography } from "@mui/material";

import { TogglePageButton, getRooms } from "@/features/rooms";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { roomId: string };
}) => {
  const room = await getRooms({ roomId: params.roomId });

  return (
    <main>
      <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", margin: "8px" }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "4px",
            margin: "4px",
          }}
        >
          <Typography component="span" sx={{ fontSize: "1.5rem" }}>
            {room.emoji}
          </Typography>
          <Typography variant="h2">{room.name}</Typography>
        </Box>
        <TogglePageButton />
      </Box>
      {children}
    </main>
  );
};

export default Layout;
