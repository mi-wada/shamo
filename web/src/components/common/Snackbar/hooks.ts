import { useContext } from "react";

import { SnackbarContext } from "./store";

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error("`useSnackbar` must be used within a SnackbarProvider");
  }
  return context;
};
