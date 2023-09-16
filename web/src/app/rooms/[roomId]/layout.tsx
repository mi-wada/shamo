import { TogglePageButton } from "@/features/rooms";
import { Box } from "@mui/material";

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
