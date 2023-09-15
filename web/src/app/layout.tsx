import type { Metadata } from "next";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ThemeRegistry from "@/components/ThemeRegistry";

if (process.env.ENABLE_MOCK) {
  require("../mock");
}

export const metadata: Metadata = {
  title: "Shamo 🐔",
  description: "Share Money Management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const prefersDarkMode = false;

  return (
    <html lang="en">
      <body>
        <ThemeRegistry darkmode={prefersDarkMode}>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
