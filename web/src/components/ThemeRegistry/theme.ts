import { createTheme } from "@mui/material/styles";

export const theme = (darkmode: boolean) =>
  createTheme({
    palette: {
      mode: darkmode ? "dark" : "light",
    },
    typography: {
      h1: {
        fontSize: "2rem",
        fontWeight: 500,
      },
      h2: {
        fontSize: "1.5rem",
        fontWeight: 500,
      },
      h3: {
        fontSize: "1.17rem",
        fontWeight: 500,
      },
    },
  });
