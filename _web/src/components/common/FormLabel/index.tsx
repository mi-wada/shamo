import { Typography } from "@mui/material";

type FormLabelProps = {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
};

export const FormLabel = ({ htmlFor, required = false, children }: FormLabelProps) => (
  <Typography variant="caption" component="label" htmlFor={htmlFor}>
    {required && (
      <Typography variant="caption" component="span" style={{ color: "red", marginRight: "4px" }}>
        *
      </Typography>
    )}
    {children}
  </Typography>
);
