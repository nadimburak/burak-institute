"use client";

import { useEffect, useState } from "react";
// import LogoImage from "@/assets/images/logo";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
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
  useScrollTrigger,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { websiteNavigation } from "./navigation";
import useAuth from "@/hooks/useAuth";

// Custom hook to detect scroll direction
const useScrollDirection = () => {
  const [scrollDir, setScrollDir] = useState<"up" | "down">("up");

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDir && Math.abs(currentScrollY - lastScrollY) > 10) {
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
          transition: "top 0.3s ease-in-out",
          borderRadius: 0, // 👈 explicitly set to 0
          boxShadow: scrollDir === "up" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
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
          {/* Logo */}
          {/* <LogoImage light={false} /> */}

          {/* Nav Links */}
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

          {/* Right Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Account">
                  <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
                    <Avatar alt={user?.name} src={avatarUrl} />
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={() => setAnchorElUser(null)}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  disableScrollLock
                  sx={{
                    mt: 5,
                    "& .MuiPaper-root": {
                      minWidth: 260,
                      p: 1,
                      boxShadow:
                        "0px 2px 8px rgba(0, 0, 0, 0.1), 0px 4px 20px rgba(0, 0, 0, 0.15)",
                      bgcolor: "background.paper",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: 2,
                      py: 1,
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Avatar alt={user?.name || "User"} src={avatarUrl} sx={{ width: 48, height: 48 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {user?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word" }}>
                        {user?.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ px: 1, py: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      fullWidth
                      onClick={() => {
                        setAnchorElUser(null);
                        router.push("/account");
                      }}
                      sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      fullWidth
                      onClick={() => {
                        setAnchorElUser(null);
                        localStorage.setItem("suppressRedirect", "true");
                        logout();
                      }}
                      sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                    >
                      Sign Out
                    </Button>
                  </Box>
                </Menu>
              </>
            ) : (
              !isMobile && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogin}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Log in
                </Button>
              )
            )}

            {/* Hamburger for Mobile */}
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Drawer */}
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 250, height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <List>
              {websiteNavigation.map(({ title, segment }) => (
                <ListItem key={title} disablePadding>
                  <ListItemButton onClick={() => handleNavigation(segment)}>
                    <ListItemText primary={title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            {!isAuthenticated && (
              <Box sx={{ mt: "auto", p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    setDrawerOpen(false);
                    handleLogin();
                  }}
                >
                  Log in
                </Button>
              </Box>
            )}
          </Box>
        </Drawer>
      </AppBar>
    </Slide>
  );
};

export default WebsiteHeader;
