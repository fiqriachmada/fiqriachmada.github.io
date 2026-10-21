import { ThemeProvider } from "next-themes";

import Header from "../components/header";
import AnalyticsTracker from "../components/analytics/analyticsTracker";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import QueryProvider from "@/components/queryProvider";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "fiqriachmada",
  description: "personal site",
};

export default function RootLayout({ children }) {
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
            "neo-brutalism",
            "neo-brutalism-dark",
            "neo-brutalism-system",
          ]}
        >
          <QueryProvider>
            <AnalyticsTracker />
            <Header />
            <div className="mx-6 lg:mx-28 my-24 lg:my-28">{children}</div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
