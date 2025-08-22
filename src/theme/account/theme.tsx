"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        primary: {
          main: "#4B7BE5", // Indigo
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#E11D48", // Rose Red
          contrastText: "#ffffff",
        },
        background: {
          default: "#F9FAFB",
          paper: "#FFFFFF",
        },
        error: {
          main: "#DC2626", // Strong red for error
        },
        text: {
          primary: "#111827",
          secondary: "#6B7280",
        },
        divider: "#E5E7EB",
      },
    },
    dark: {
      palette: {
        mode: "dark",
        primary: {
          main: "#4B7BE5",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#E11D48",
          contrastText: "#ffffff",
        },
        background: {
          default: "#111827",
          paper: "#1F2937",
        },
        error: {
          main: "#F87171",
        },
        text: {
          primary: "#F3F4F6",
          secondary: "#9CA3AF",
        },
        divider: "#374151",
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  typography: {
    fontFamily: `"Geist", "Inter", "Segoe UI", "Roboto", "Arial", sans-serif`,
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 600 },
    h3: { fontSize: "1.5rem", fontWeight: 600 },
    body1: { fontSize: "1rem", fontWeight: 400 },
    body2: { fontSize: "0.875rem" },
    button: { fontWeight: 400 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          transition: "all 0.3s ease",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
          },
          "&:active": {
            transform: "scale(0.98)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0px 6px 18px rgba(0,0,0,0.04)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          animation: "fadeIn 0.6s ease",
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "scale(0.95)" },
            to: { opacity: 1, transform: "scale(1)" },
          },
        },
      },
    },
  },
});

export default theme;
