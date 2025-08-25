"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import websiteTheme from "./webTheme";

export default function WebsiteThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const prefersLight = window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;
    setMode(prefersLight ? "light" : "dark");
    setMounted(true);
  }, []);

  // When the component is mounted
  useEffect(() => {
    document.body.style.transition =
      "background-color 0.3s ease, color 0.3s ease";
  }, [mode]);

  if (!mounted) return null;

  return (
    <ThemeProvider theme={websiteTheme}>
      <CssBaseline enableColorScheme>{children}</CssBaseline>
    </ThemeProvider>
  );
}
