"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

function NeoSystemListener() {
  const { theme } = useTheme();

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme !== "neo-system") {
      root.classList.remove("neo-light");
      if (theme !== "neo-dark") root.classList.remove("neo-dark");
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateClass = () => {
      root.classList.remove("neo-light", "neo-dark", "light", "dark");
      if (media.matches) {
        root.classList.add("neo-dark", "dark");
      } else {
        root.classList.add("neo-light", "light");
      }
    };

    updateClass();
    media.addEventListener("change", updateClass);
    return () => media.removeEventListener("change", updateClass);
  }, [theme]);

  return null;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <NeoSystemListener />
      {children}
    </NextThemesProvider>
  );
}
