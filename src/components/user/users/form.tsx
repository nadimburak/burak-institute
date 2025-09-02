"use client";

import ImageFileUpload from "@/components/form/imageUpload";
import RoleAutocomplete from "@/components/user/roles/roleAutocomplete";
import { IUser } from "@/models/user/User.model";
import axiosInstance from "@/utils/axiosInstance";
import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DialogProps, useNotifications } from "@toolpad/core";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { defaultValues, fetchUserUrl } from "./constant";
import { useSession } from 'next-auth/react';

// Validation schema
const validationSchema = yup.object().shape({
  role: yup.object().shape({
    _id: yup.string().required("Role is required"),
    name: yup.string().required("Role is required"),
  }),
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid Email Address"
    ),
  password: yup
    .string()
    .required("Password is required.")
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character."
    ),
  status: yup.boolean().required("Status is required"),
});

interface FormProps extends DialogProps<undefined, string | null> {
  id: unknown;
}

export default function UserForm({ id, open, onClose }: FormProps) {
  const router = useRouter();
  const notifications = useNotifications();
  const [showPassword, setShowPassword] = useState(false);

  const { data: session } = useSession();

  const user = session?.user
  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<IUser>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  });

  const role = watch("role");


  const onSubmit = async (data: IUser) => {
    let url = `${fetchUserUrl}/`;
    let method: "post" | "put" = "post";

    if (id != "new") {
      url = `${fetchUserUrl}/${id}`;
      method = "put";
    }

    try {
      const response = await axiosInstance.request({
        url,
        method,
        data,
      });

      if (response.status == 200 || response.status == 201) {
        notifications.show(response.data.message, {
          severity: "success",
          autoHideDuration: 3000,
        });
      }

      onClose("true");
    } catch (error: unknown) {
      const errorMessage = handleErrorMessage(error);
      notifications.show(errorMessage, {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const bindData = useCallback(
    async (id: unknown) => {
      try {
        const response = await axiosInstance.get(`${fetchUserUrl}/${id}`);
        reset(response.data);
      } catch (error: unknown) {
        const { response } = error as unknown as {
          response: { status: number };
        };
        if (response && response.status == 403) {
          router.push("/forbidden");
        }
      }
    },
    [router, reset]
  );

  useEffect(() => {
    if (id && id != "new") {
      bindData(id);
    }
  }, [id, bindData]);

  return (
    <Dialog fullWidth open={open} onClose={() => onClose(null)}>
      <DialogTitle>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5">
            {id != "new" ? "Update User" : "Create User"}
          </Typography>
          <IconButton onClick={() => onClose(null)}>
            <Icon>close</Icon>
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container mt={1} spacing={2}>
            <Grid size={12}>
              <RoleAutocomplete
                value={role}
                setValue={setValue}   // react-hook-form ka setValue
                error={!!errors.role}
                helperText={errors.role ? "Role is required" : ""}
              />

            </Grid>

            <Grid size={12}>
              <ImageFileUpload
                value={watch("image") ?? ""}
                maxFileSize="50MB"
                setValue={(e) => setValue("image", e)}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Name"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register("name")}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Email"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email")}
              />
            </Grid>

            <Grid size={{ md: 12, sm: 12, xs: 12 }}>
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

            {/* 🔹 Radio Group sirf super_admin ke liye */}
            {user?.type === "super_admin" && (
              <Grid size={12}>
                <FormControl component="fieldset" error={!!errors.type}>
                  <FormLabel component="legend">User Type</FormLabel>
                  <RadioGroup
                    row
                    value={watch("type")}
                    onChange={(e) =>
                      setValue("type", e.target.value as IUser["type"], {
                        shouldValidate: true,
                      })
                    }
                  >
                    <FormControlLabel
                      value="super_admin"
                      control={<Radio />}
                      label="Super Admin"
                    />
                    <FormControlLabel
                      value="user"
                      control={<Radio />}
                      label="User"
                    />
                  </RadioGroup>
                  {typeof errors.type?.message === "string" && (
                    <Typography variant="caption" color="error">
                      {errors.type.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            )}
          </Grid>

          <FormControlLabel
            control={
              <Switch
                {...register("status")}
                checked={watch("status")}
                onChange={(e) => setValue("status", e.target.checked)}
                color="primary"
              />
            }
            label={watch("status") ? "Active" : "Inactive"}
          />

          <Box marginTop={2} display="flex" justifyContent="space-between">
            <Button
              type="button"
              variant="contained"
              color="secondary"
              onClick={() => reset()}
            >
              Reset
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {id != "new" ? "Update" : "Create"}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
