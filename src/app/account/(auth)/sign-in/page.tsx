"use client";

import useAuth from "@/hooks/useAuth";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { keyframes, Stack } from "@mui/system";
import { useRouter } from "next/navigation";
import * as React from "react";

// 🎯 Animations
const fadeSlideLeft = keyframes`
  0% { opacity: 0; transform: translateX(-10px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const zoomIn = keyframes`
  0% { opacity: 0; transform: scale(0.98); }
  100% { opacity: 1; transform: scale(1); }
`;

export default function CustomSignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const theme = useTheme();
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return setError("Email is required");
    if (!email.includes("@")) return setError("Enter a valid email");
    if (!password) return setError("Password is required");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");

    setError("");
    try {
      await login({ email, password });
      const redirectPath = localStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      } else {
        router.push("/"); // fallback if no path saved
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left Section */}
      <Grid
        size={{ md: 6, xs: 12 }}
        sx={{
          background: {
            xs: theme.palette.primary.main,
            md: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
          },
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          textAlign: "center",
          animation: `${fadeSlideLeft} 0.8s ease-out`,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{
            fontSize: { xs: "24px", md: "40px" },
            whiteSpace: "nowrap",
            overflow: "hidden",
            borderRight: "2px solid white",
            width: "100%",
            maxWidth: "28ch",
            animation: `
            typingFade 2.5s steps(28) 0.3s forwards,
            cursorBlink 0.75s step-end 3.1s 3,
            cursorHide 0.1s ease 5.4s forwards
            `,
            "@keyframes typingFade": {
              from: { width: 0, opacity: 0 },
              "10%": { opacity: 1 },
              to: { width: "28ch", opacity: 1 },
            },
            "@keyframes cursorBlink": {
              "0%, 100%": { borderColor: "transparent" },
              "50%": { borderColor: "white" },
            },
            "@keyframes cursorHide": {
              to: { borderColor: "transparent" },
            },
          }}
        >
          Welcome back Customer!
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: 400,
            fontSize: { xs: "14px", md: "16px" },
            mt: 1,
            opacity: 0,
            animation: `${fadeSlideLeft} 1.2s ease-out 1s forwards`,
          }}
        >
          Your journey continues here. Sign in to Access your dashboard,
          explore, manage, and grow.
        </Typography>
      </Grid>

      {/* Right Section */}
      <Grid
        size={{ md: 6, xs: 12 }}
        component={Paper}
        elevation={6}
        square
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          px: 4,
          animation: `${zoomIn} 0.6s ease-out 0.5s forwards`,
          opacity: 0,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: "100%", maxWidth: 400 }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            mb={2}
            sx={{ fontSize: { xs: "20px", md: "28px" } }}
          >
            Sign In
          </Typography>

          {error && (
            <Typography
              color="error"
              variant="body2"
              mb={2}
              sx={{ fontSize: { xs: "13px", md: "14px" } }}
            >
              {error}
            </Typography>
          )}

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            size="small"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            size="small"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label="Remember Me"
            sx={{ mb: 2 }}
          />

          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Sign In
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
              }}
              onClick={() => {
                router.push("/account/sign-up");
              }}
            >
              Sign Up
            </Button>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
}
