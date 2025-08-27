import { ProfilePasswordModel } from "@/models/user/profile.model";
import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DialogProps, useNotifications } from "@toolpad/core";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { defaultValues, updatePasswordUrl } from "./constant";
import axiosInstance from "@/utils/axiosInstance";
import { handleErrorMessage } from "@/utils/errorHandler";

interface ProfileFormProps extends DialogProps<undefined, string | null> {
  id?: any;
}

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character."
    ),
  new_password: yup
    .string()
    .required("New Password is required")
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character."
    ),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function UpdateProfilePassword({
  open,
  onClose,
  id,
}: ProfileFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const notifications = useNotifications();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfilePasswordModel>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (id) {
      reset(id);
    }
  }, [id, reset]);

  const onSubmit = async (data: ProfilePasswordModel) => {
    try {
      const response = await axiosInstance.put(updatePasswordUrl, data);

      if (response.status === 200 || response.status === 201) {
        notifications.show("Password Update Successfully!", {
          severity: "success",
          autoHideDuration: 2000,
        });
        onClose("true");
      }
    } catch (error: any) {
      const errorMessage = handleErrorMessage(error);
      notifications.show(errorMessage, {
        severity: "error",
        autoHideDuration: 3000,
      });
      onClose("false");
    }
  };

  return (
    <>
      <Dialog fullWidth open={open} onClose={() => onClose(null)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5" fontWeight={600}>
                Update Profile
              </Typography>
              <IconButton onClick={() => onClose(null)} size="small">
                <Icon fontSize="small">close</Icon>
              </IconButton>
            </Stack>
          </DialogTitle>

          <DialogContent sx={{ pt: 1 }}>
            <Grid container spacing={2} mt={1}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Password*"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  error={!!errors.password}
                  InputLabelProps={{ shrink: true }}
                  helperText={
                    errors.password?.type === "required"
                      ? errors.password.message
                      : errors.password?.type === "matches"
                        ? "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character."
                        : ""
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  {...register("new_password")}
                  error={!!errors.new_password}
                  helperText={errors.new_password?.message}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirm_password")}
                  error={!!errors.confirm_password}
                  helperText={errors.confirm_password?.message}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" justifyContent="space-between">
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={() => reset()}
              >
                Reset
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {id ? "Update" : "Create"}
              </Button>
            </Box>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
