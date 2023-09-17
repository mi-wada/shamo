import { Box } from "@mui/material";

import { TogglePageButton } from "@/features/rooms";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Box sx={{ display: "flex", justifyContent: "center", margin: "8px" }}>
        <TogglePageButton />
      </Box>
      {children}
    </main>
  );
};

export default Layout;
