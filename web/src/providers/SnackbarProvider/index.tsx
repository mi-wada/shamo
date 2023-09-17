"use client";
import { CheckCircle, Error as ErrorIcon } from "@mui/icons-material";
import { Slide, type SlideProps, Snackbar as MuiSnackbar, Typography, Box } from "@mui/material";
import { createContext, useContext, useState } from "react";

type SnackbarContextProps = {
  showSnackbar: ({ message, success }: { message: string; success: boolean }) => void;
  hideSnackbar: () => void;
  open: boolean;
  message: string;
  success: boolean;
};

const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

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

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error("`useSnackbar` must be used within a SnackbarProvider");
  }
  return context;
};

type TransitionProps = Omit<SlideProps, "direction">;
const RightSlide = (props: TransitionProps) => <Slide {...props} direction="right" />;

export const Snackbar = () => {
  const { hideSnackbar, open, message, success } = useSnackbar();

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={3500}
      onClose={hideSnackbar}
      TransitionComponent={RightSlide}
      message={
        <Box sx={{ flex: "display", alignItems: "center" }}>
          {success ? <CheckCircle color="success" /> : <ErrorIcon color="error" />}
          <Typography variant="body1" component="span" sx={{ marginLeft: "4px" }}>
            {message}
          </Typography>
        </Box>
      }
      key={"TODO"}
      sx={{ maxWidth: "60vw", position: "fixed", left: "8px", bottom: "24px" }}
    />
  );
};
