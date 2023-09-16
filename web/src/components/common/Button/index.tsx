import { Button as MuiButton, type ButtonProps as MuiButtonProps } from "@mui/material";
import { Loading } from "../Loading";

export type ButtonProps = {
  /**
   * @default false
   */
  loading?: boolean;
  /**
   * @default false
   */
  disabled?: boolean;
  sx?: MuiButtonProps["sx"];
  color?: MuiButtonProps["color"];
  onClick?: () => void;
  type?: MuiButtonProps["type"];
  children: React.ReactNode;
};

export const Button = ({ loading, disabled, children, ...props }: ButtonProps) => (
  <MuiButton variant="outlined" disabled={loading || disabled} {...props}>
    {loading ? <Loading size="small" /> : children}
  </MuiButton>
);
