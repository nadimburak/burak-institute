"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
// import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import axiosInstance from "@/utils/axiosInstance";
import { useNotifications } from "@toolpad/core";
import { handleErrorMessage } from "@/utils/errorHandler";
import { defaultValues, fetchUrl } from "./constant";
import ClassesAutocomplete from "../autocomplete/classes/ClassAutocomplete";
import { IClassSection } from "@/models/ClassSection";

// Yup validation schema
const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  class: yup.object().shape({
    _id: yup.string().required("Class is required"),
  }),
});

interface ClassSectionFormProps {
  id?: string | "new";
  open: boolean;
  onClose: (success?: boolean) => void;
}

export default function ClassSectionForm({
  id = "new",
  open,
  onClose,
}: ClassSectionFormProps) {
  // const router = useRouter();
  const notifications = useNotifications();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IClassSection>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  // Fetch existing data for edit - wrapped in useCallback
  const bindData = async (id: string | number) => {
    try {
      const response = await axiosInstance.get(`${fetchUrl}/${id}`);
      console.log("API DATA:", response.data.data);
      reset(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (id && id !== "new") {
      bindData(id);
    }
  }, [id]);

  const onSubmit = async (data: IClassSection) => {
    try {
      const payload = { ...data };
      let res;
      if (id !== "new") {
        res = await axiosInstance.put(`${fetchUrl}/${id}`, payload);
      } else {
        res = await axiosInstance.post(fetchUrl, payload);
      }
      notifications.show(res.data.message, {
        severity: "success",
        autoHideDuration: 3000,
      });
      onClose(true);
    } catch (error: unknown) {
      const errorMessage = handleErrorMessage(error);
      notifications.show(errorMessage, {
        severity: "error",
        autoHideDuration: 3000,
      });
    }
  };

  return (
    <Dialog fullWidth open={open} onClose={() => onClose()}>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h5">
            {id !== "new" ? "Update Class Section" : "Create Class Section"}
          </Typography>
          <IconButton onClick={() => onClose()}>
            <Icon>close</Icon>
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ClassesAutocomplete
            setValue={setValue}
            value={watch("class")}
            error={!!errors.class}
            helperText={errors.class?.message ? "Class is required" : ""}
          />
          <TextField
            label="Section Name"
            variant="outlined"
            fullWidth
            margin="normal"
            size="medium"
            {...register("name")}
            InputLabelProps={{
              shrink: true,
              sx: {
                color: "text.primary",
              },
            }}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => reset(defaultValues)}
            >
              Reset
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {id !== "new" ? "Update" : "Create"}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
