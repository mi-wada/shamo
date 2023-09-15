import { OpenInNew } from "@mui/icons-material";
import { Link as MuiLink } from "@mui/material";
import NextLink from "next/link";
import { muiLinkStyle, openInNewIconStyle } from "./style";

type LinkProps = {
  href: string;
  children: React.ReactNode;
};

export const Link = ({ href, children }: LinkProps) => {
  const external = href.startsWith("http");

  return external ? (
    <MuiLink
      component={NextLink}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={muiLinkStyle}
    >
      <OpenInNew sx={openInNewIconStyle} />
      {children}
    </MuiLink>
  ) : (
    <MuiLink component={NextLink} href={href}>
      {children}
    </MuiLink>
  );
};
