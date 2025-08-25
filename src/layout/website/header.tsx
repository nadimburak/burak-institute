"use client";

import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Slide,
  Divider,
} from "@mui/material";

import { useRouter } from "next/navigation";
import { websiteNavigation } from "./navigation";
import useAuth from "@/hooks/useAuth";
import { useThemeMode } from "@/theme/website/themeContext";


// 🔽 scroll direction hook
const useScrollDirection = () => {
  const [scrollDir, setScrollDir] = useState<"up" | "down">("up");

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? "down" : "up";
      if (
        direction !== scrollDir &&
        Math.abs(currentScrollY - lastScrollY) > 10
      ) {
        setScrollDir(direction);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollDir]);

  return scrollDir;
};

const WebsiteHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const { isAuthenticated, user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode(); // 🌙 light/dark hook

  const scrollDir = useScrollDirection();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogin = () => router.push("/account/sign-in");
  const handleNavigation = (path: string) => {
    setDrawerOpen(false);
    router.push(`/${path}`);
  };

  const avatarUrl = user?.image
    ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/uploads/${user.image}`
    : "";

  return (
    <Slide appear={false} direction="down" in={scrollDir === "up"}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderColor: "divider",
          backdropFilter: "blur(10px)",
          zIndex: 1300,
          boxShadow:
            scrollDir === "up" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* 🔹 Logo (abhi comment rakha hai, chahe to add karo) */}
          {/* <LogoImage light={false} /> */}

          {/* 🔹 Nav Links (Desktop only) */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, ml: 4 }}>
              {websiteNavigation.map(({ title, segment }) => (
                <Typography
                  key={segment}
                  onClick={() => handleNavigation(segment)}
                  sx={{
                    cursor: "pointer",
                    fontWeight: 500,
                    px: 1,
                    color: theme.palette.text.primary,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -4,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      backgroundColor: theme.palette.primary.main,
                      transform: "scaleX(0)",
                      transition: "transform 0.3s ease",
                      transformOrigin: "right",
                    },
                    "&:hover::after": {
                      transform: "scaleX(1)",
                      transformOrigin: "left",
                    },
                  }}
                >
                  {title}
                </Typography>
              ))}
            </Box>
          )}

          {/* 🔹 Right Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* 🌙 Theme Toggle */}
            <IconButton onClick={toggleMode} color="inherit">
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            {isAuthenticated ? (
              <>
                <Tooltip title="Account">
                  <IconButton
                    onClick={(e) => setAnchorElUser(e.currentTarget)}
                    sx={{ p: 0 }}
                  >
                    <Avatar alt={user?.name} src={avatarUrl} />
                  </IconButton>
                </Tooltip>
                {/* User Menu yahan add karna chahe to */}
              </>
            ) : (
              !isMobile && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogin}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "8px",
                    px: 3,
                  }}
                >
                  Log in
                </Button>
              )
            )}

            {/* 🔹 Mobile Menu Button */}
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* 🔹 Mobile Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 250, p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Menu</Typography>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider sx={{ my: 2 }} />

            <List>
              {websiteNavigation.map(({ title, segment }) => (
                <ListItem key={segment} disablePadding>
                  <ListItemButton onClick={() => handleNavigation(segment)}>
                    <ListItemText primary={title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            {!isAuthenticated && (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleLogin}
                sx={{ mt: 2, borderRadius: "8px" }}
              >
                Log in
              </Button>
            )}
          </Box>
        </Drawer>
      </AppBar>
    </Slide>
  );
};

export default WebsiteHeader;
