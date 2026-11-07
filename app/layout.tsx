import type React from "react";
import { ThemeProvider } from "next-themes";

import FloatingNav from "../components/navigation/floatingNav";
import AnalyticsTracker from "../components/analytics/analyticsTracker";
import QueryProvider from "../components/providers/query-provider";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "fiqriachmada",
  description: "personal site",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="E9my8MvFE40cVa4KkhP3LP9b6XHVcsAc7oFbi5S3EPs"
        />
      </head>
      <body className={`${jakarta.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          themes={[
            "light",
            "dark",
            "system",
            "neo-light",
            "neo-dark",
            "neo-system",
          ]}
        >
          <QueryProvider>
            <AnalyticsTracker />
            <FloatingNav />
            <main className="mx-6 lg:mx-28 my-10 lg:my-14 min-h-[calc(100vh-5rem)]">
              {children}
            </main>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
