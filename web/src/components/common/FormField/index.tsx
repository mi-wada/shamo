import { Box, Input, type InputProps, Select, type SelectProps, Typography } from "@mui/material";
import React from "react";

import { FormLabel } from "../FormLabel";

type FormFieldProps = {
  /**
   * This value automatically set to `for` prop of label component.
   */
  id: string;
  value: unknown;
  label: React.ReactNode;
  required?: boolean;
  error?: string;
};

type FormInputFieldProps = FormFieldProps & {
  type: InputProps["type"];
  onChange: InputProps["onChange"];
  placeholder?: InputProps["placeholder"];
};

export const FormInputField = ({
  type,
  value,
  onChange,
  placeholder,
  id,
  label,
  required = false,
  error,
}: FormInputFieldProps) => (
  <Box sx={{ margin: "8px", display: "block" }}>
    <FormLabel htmlFor={id} required={required}>
      {label}
    </FormLabel>
    <Input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      sx={{ width: "100%" }}
    />
    {error && (
      <Typography variant="caption" color="error">
        {error}
      </Typography>
    )}
  </Box>
);

type FormSelectFieldProps = FormFieldProps & {
  onChange: SelectProps["onChange"];
  children: React.ReactNode;
};

export const FormSelectField = ({
  id,
  value,
  label,
  required = false,
  error,
  onChange,
  children,
}: FormSelectFieldProps) => (
  <Box sx={{ margin: "8px", display: "block" }}>
    <FormLabel htmlFor={id} required={required}>
      {label}
    </FormLabel>
    <Select
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      sx={{ width: "100%", height: "40px" }}
    >
      {children}
    </Select>
    {error && (
      <Typography variant="caption" color="error">
        {error}
      </Typography>
    )}
  </Box>
);
