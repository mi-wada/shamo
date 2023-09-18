"use client";
import { CheckCircle, Error as ErrorIcon } from "@mui/icons-material";
import { Slide, type SlideProps, Snackbar as MuiSnackbar, Typography, Box } from "@mui/material";

import { useSnackbar } from "./hooks";

type TransitionProps = Omit<SlideProps, "direction">;
const RightSlide = (props: TransitionProps) => <Slide {...props} direction="right" />;

export const Snackbar = () => {
  const { hideSnackbar, open, message, success } = useSnackbar();

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={7000}
      onClose={hideSnackbar}
      TransitionComponent={RightSlide}
      message={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
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
