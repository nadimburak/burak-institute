"use client";

import { useEffect, useState } from "react";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import theme from "./theme";

export default function ThemeRegistry({
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
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }, [mode]);

  if (!mounted) return null;

  return (
    <CssVarsProvider
      theme={theme}
      attribute="data-toolpad-color-scheme"
      defaultMode={mode}
      enableColorScheme
      element="body"
    >
      {children}
    </CssVarsProvider>
  );
}
