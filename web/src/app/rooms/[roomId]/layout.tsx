import { Box, Typography } from "@mui/material";

import { TogglePageButton } from "@/features/rooms";

const Layout = ({ children }: { children: React.ReactNode }) => {
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
            👾
          </Typography>
          <Typography variant="h2">ほげほげの部屋</Typography>
        </Box>
        <TogglePageButton />
      </Box>
      {children}
    </main>
  );
};

export default Layout;
