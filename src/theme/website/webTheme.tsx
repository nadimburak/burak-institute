import { createTheme } from "@mui/material/styles";

const websiteTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#8a0dffff", // Purple
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
          fontWeight: 500,
          transition: "all 0.3s ease",
          padding: "8px 20px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          },
          "&:active": {
            transform: "scale(0.97)",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: "none",
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          animation: "fadeIn 0.4s ease",
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "scale(0.95)" },
            to: { opacity: 1, transform: "scale(1)" },
          },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "0.75rem",
          borderRadius: 6,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffffcc",
          backdropFilter: "blur(12px)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "#F1F5F9",
        },
      },
    },
  },
});

export default websiteTheme;
