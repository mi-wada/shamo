import { createContext } from "react";

type SnackbarContextProps = {
  showSnackbar: ({ message, success }: { message: string; success: boolean }) => void;
  hideSnackbar: () => void;
  open: boolean;
  message: string;
  success: boolean;
};

export const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);
