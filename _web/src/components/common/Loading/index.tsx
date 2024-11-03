import { CircularProgress } from "@mui/material";

export type LoadingProps = {
  size: "small" | "medium" | "large";
};

export const Loading = ({ size }: LoadingProps) => (
  <>
    <CircularProgress
      size={size === "small" ? 20 : size === "medium" ? 40 : size === "large" ? 60 : undefined}
    />
  </>
);
