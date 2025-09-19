"use client";

import { useEffect, useState } from "react";
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

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";

import { useRouter } from "next/navigation";

import { websiteNavigation } from "./navigation";

// ✅ NextAuth
import { useSession, signOut } from "next-auth/react";

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
  // const { mode, toggleMode } = useThemeMode();

  const scrollDir = useScrollDirection();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ✅ NextAuth session
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  const user = session?.user;

  const handleLogin = () => router.push("/auth/signin");
  const handleLogout = () => signOut();

  const handleNavigation = (path: string) => {
    setDrawerOpen(false);
    router.push(`/${path}`);
  };

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
          {/* 🔹 Logo */}
          <Typography
            variant="h2"
            sx={{ cursor: "pointer" }}
            onClick={() => router.push("/")}
            color="primary.main"
          >
            Burak Institute
          </Typography>
          {/* <Typography sx={{ ml: 2 }}>
            Current Mode: {mode}
          </Typography> */}


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
                    color: "text.primary",
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
            {/* <IconButton onClick={toggleMode} color="inherit">
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton> */}

            {isAuthenticated ? (
              <>
                <Tooltip title="Account">
                  <IconButton
                    onClick={(e) => setAnchorElUser(e.currentTarget)}
                    sx={{ p: 0 }}
                  >
                    <Avatar
                      alt={user?.name ?? ""}
                      src={user?.image ?? ""}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={() => setAnchorElUser(null)}
                >
                  <ListItemButton onClick={() => router.push("/dashboard")}>
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </Menu>
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
              <Typography variant="h1">Menu</Typography>
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

            {!isAuthenticated ? (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleLogin}
                sx={{ mt: 2, borderRadius: "8px" }}
              >
                Log in
              </Button>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={handleLogout}
                sx={{ mt: 2, borderRadius: "8px" }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Drawer>
      </AppBar>
    </Slide>
  );
};

export default WebsiteHeader;
