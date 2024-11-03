"use client";
import { useState } from "react";

import { SnackbarContext } from "./store";

export const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [{ open, message, success }, setSnackbarProps] = useState({
    open: false,
    message: "",
    success: true,
  });

  const showSnackbar = ({ message, success }: { message: string; success: boolean }) => {
    setSnackbarProps({ open: true, message, success });
  };
  const hideSnackbar = () => setSnackbarProps({ open: false, message: "", success: true });

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar, open, message, success }}>
      {children}
    </SnackbarContext.Provider>
  );
};
