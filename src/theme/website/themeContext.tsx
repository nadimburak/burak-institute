"use client";

import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import getWebsiteTheme from "./webTheme"; // aapka existing theme config

type ThemeMode = "light" | "dark";

interface ThemeContextProps {
    mode: ThemeMode;
    toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
    mode: "light",
    toggleMode: () => { },
});

export const useThemeMode = () => useContext(ThemeContext);

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // localStorage se theme load karo
        const savedMode = localStorage.getItem("themeMode") as ThemeMode | null;
        if (savedMode) {
            setMode(savedMode);
        } else {
            const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
            setMode(prefersLight ? "light" : "dark");
        }
        setMounted(true);
    }, []);

    const toggleMode = () => {
        setMode((prev) => {
            const newMode = prev === "light" ? "dark" : "light";
            localStorage.setItem("themeMode", newMode);
            return newMode;
        });
    };

    const theme = useMemo(() => createTheme(getWebsiteTheme(mode)), [mode]);

    if (!mounted) return null;

    return (
        <ThemeContext.Provider value={{ mode, toggleMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}
