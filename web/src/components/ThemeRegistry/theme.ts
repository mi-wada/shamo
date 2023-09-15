import { createTheme } from "@mui/material/styles";

export const theme = (darkmode: boolean) =>
  createTheme({
    palette: {
      mode: darkmode ? "dark" : "light",
    },
  });
