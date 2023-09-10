import { Button as MuiButton, type ButtonProps as MuiButtonProps } from "@mui/material";

export type ButtonProps = {
  /**
   * @default false
   */
  loading?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export const Button = ({ loading, children, ...props }: ButtonProps) => (
  <MuiButton disabled={loading} {...props}>
    {loading ? "Loading..." : children}
  </MuiButton>
);
