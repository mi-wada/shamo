import { Delete, Edit } from "@mui/icons-material";
import {
  IconButton as MuiIconButton,
  type IconButtonProps as MuiIconButtonProps,
} from "@mui/material";

const iconProps: Record<
  ButtonProps["iconType"],
  {
    icon: React.ReactNode;
    color: MuiIconButtonProps["color"];
    "aria-label": string;
  }
> = {
  delete: {
    icon: <Delete fontSize="inherit" />,
    color: "error",
    "aria-label": "delete",
  },
  edit: {
    icon: <Edit fontSize="inherit" />,
    color: "secondary",
    "aria-label": "edit",
  },
};

export type ButtonProps = {
  iconType: "delete" | "edit";
  /**
   * @default false
   */
  disabled?: boolean;
  size?: MuiIconButtonProps["size"];
  onClick: () => void;
};

export const IconButton = ({ iconType, ...props }: ButtonProps) => {
  return (
    <MuiIconButton
      aria-label={iconProps[iconType]["aria-label"]}
      color={iconProps[iconType]["color"]}
      {...props}
    >
      {iconProps[iconType]["icon"]}
    </MuiIconButton>
  );
};
