"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import getWebsiteTheme from "./webTheme";

export default function WebsiteThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    setMode(prefersLight ? "light" : "dark");
    setMounted(true);
  }, []);

  const theme = useMemo(() => createTheme(getWebsiteTheme(mode)), [mode]);

  if (!mounted) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
