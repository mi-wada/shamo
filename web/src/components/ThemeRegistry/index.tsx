"use client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";

import NextAppDirEmotionCacheProvider from "./EmotionCache";
import { theme } from "./theme";

// Copy from https://github.com/mui/material-ui/tree/97a1e7aaac85555ef00f931e76f7e08ab7cca7d3/examples/material-ui-nextjs-ts/src/components/ThemeRegistry
export default function ThemeRegistry({
  darkmode,
  children,
}: {
  darkmode: boolean;
  children: React.ReactNode;
}) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme(darkmode)}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
