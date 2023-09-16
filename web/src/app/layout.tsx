import type { Metadata } from "next";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import { AppBar } from "@/components/common/AppBar";
import { MSWInitClientSide } from "@/mock/MSWInitClientSide";

if (process.env.NEXT_PUBLIC_ENABLE_MOCK) {
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
      <body style={{ margin: "8px" }}>
        {/* TODO: Workaround to avoid error before MSW starts. If there are better ways, Let's fix */}
        <MSWInitClientSide>
          <ThemeRegistry darkmode={prefersDarkMode}>
            <header>
              <AppBar />
            </header>
            {children}
          </ThemeRegistry>
        </MSWInitClientSide>
      </body>
    </html>
  );
}
