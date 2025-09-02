"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DialogProps, useNotifications } from "@toolpad/core";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { defaultValues, fetchUrl } from "./constant";
import PermissionSelect from "./permissions";
import axiosInstance from "@/utils/axiosInstance";
import { handleErrorMessage } from "@/utils/errorHandler";
import { IRole } from "@/models/user/Role.model";

// Define the validation schema using Yup
const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
});

interface FormProps extends DialogProps<undefined, string | null> {
  id: unknown;
}

export default function RoleForm({ id, open, onClose }: FormProps) {
  const router = useRouter();
  const notifications = useNotifications();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IRole>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  });

  // Handle form submission
  const onSubmit = async (data: IRole) => {
    console.log("Form Submitted:", data);

    // Define the endpoint based on whether it's a create or update operation
    let url = `${fetchUrl}`;
    let method: "post" | "put" = "post";

    if (id != "new") {
      url = `${fetchUrl}/${id}`;
      method = "put";
    }

    try {
      // Send form data to the server
      const response = await axiosInstance.request({
        url,
        method,
        data, // Form data
      });

      // Handle success
      console.log("Server Response:", response.data);

      if (response.status == 200 || response.status == 201) {
        const { data } = response;
        notifications.show(data.message, {
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
        const response = await axiosInstance.get(`${fetchUrl}/${id}`);
        reset(response.data);
        setValue("name", response.data.name);
        setValue(
          "permissions",
          (response.data.permissions as { _id: string }[]).map((p: { _id: string }) => p._id)
        );
      } catch (error: unknown) {
        const { response } = error as unknown as {
          response: { status: number };
        };
        if (response && response.status == 403) {
          router.push("/forbidden");
        }
      }
    },
    [reset, router, setValue]
  );

  const permissions = watch("permissions");

  useEffect(() => {
    if (id) {
      if (id != "new") {
        bindData(id);
      }
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
            {id != "new" ? "Update Role" : "Create Role"}
          </Typography>
          <IconButton onClick={() => onClose(null)}>
            <Icon>close</Icon>
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={{ sm: 12, md: 12 }}>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register("name")}
              />
            </Grid>
            <Grid size={{ sm: 12, md: 12 }}>
              <PermissionSelect
                value={permissions}
                onChange={(e: string[]) => setValue("permissions", e)}
              />
            </Grid>
          </Grid>

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
