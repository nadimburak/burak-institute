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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNotifications } from "@toolpad/core";
import { useRouter } from "next/navigation";

// 🎯 Animations
const fadeSlideLeft = keyframes`
  0% { opacity: 0; transform: translateX(-10px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const zoomIn = keyframes`
  0% { opacity: 0; transform: scale(0.98); }
  100% { opacity: 1; transform: scale(1); }
`;

type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const notifications = useNotifications();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await signUp({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password,
        type: "customer", // or another appropriate value for 'type'
      });

      notifications.show("Account created & logged in!", {
        severity: "success",
      });
      router.push("/account");
    } catch (error: unknown) {
      let message = "Something went wrong. Please try again.";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        message = err.response?.data?.message || message;
      }
      notifications.show(message, { severity: "error" });
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left Panel */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          background: {
            xs: theme.palette.primary.main,
            md: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
          },
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          p: 4,
          animation: `${fadeSlideLeft} 0.8s ease-out`,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
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
            Create Your Account
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: 400,
              fontSize: { xs: "14px", md: "16px" },
              mt: 2,
              opacity: 0,
              animation: `${fadeSlideLeft} 1.2s ease-out 1s forwards`,
            }}
          >
            Join us today and unlock the full experience. Sign up to manage your
            dashboard and stay connected.
          </Typography>
        </Box>
      </Grid>

      {/* Right Panel */}
      <Grid
        size={{ xs: 12, md: 6 }}
        component={Paper}
        elevation={6}
        square
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 8,
          px: 4,
          animation: `${zoomIn} 0.6s ease-out 0.5s forwards`,
          opacity: 0,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%", maxWidth: 400 }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            mb={2}
            sx={{ fontSize: { xs: "20px", md: "28px" } }}
          >
            Sign Up
          </Typography>

          <TextField
            label="Name"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Email"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            fullWidth
            size="small"
            type={showPassword ? "text" : "password"}
            sx={{ mb: 2 }}
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
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
            control={<Checkbox size="small" />}
            label="I agree to the terms & conditions"
            sx={{ mb: 2 }}
          />

          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ py: 1.5, borderRadius: 2 }}
              onClick={() => router.push("/account/sign-in")}
            >
              Sign In
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              Create Account
            </Button>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
}
