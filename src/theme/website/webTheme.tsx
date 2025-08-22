// src/theme/webTheme.ts
import { ThemeOptions } from "@mui/material/styles";

export default function getWebsiteTheme(mode: "light" | "dark"): ThemeOptions {
  return {
    palette: {
      mode,
      primary: {
        main: "#808000", // Purple
        contrastText: "#fff",
      },
      secondary: {
        main: "#E11D48", // Rose Red
        contrastText: "#fff",
      },
      ...(mode === "light"
        ? {
          background: {
            default: "#F9FAFB",
            paper: "#FFFFFF",
          },
          text: {
            primary: "#111827",
            secondary: "#6B7280",
          },
          divider: "#E5E7EB",
        }
        : {
          background: {
            default: "#0F172A",
            paper: "#1E293B",
          },
          text: {
            primary: "#F1F5F9",
            secondary: "#94A3B8",
          },
          divider: "#334155",
        }),
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: `"Geist", "Inter", "Segoe UI", "Roboto", "Arial", sans-serif`,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 500,
            padding: "8px 20px",
          },
        },
      },
    },
  };
}
