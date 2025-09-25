"use client";

import { useForm, Controller, SubmitErrorHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Box,
} from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import SubjectAutocomplete from "@/components/autocomplete/SubjectAutocomplete";
import axiosInstance from "@/utils/axiosInstance";
import { fetchUrl } from "./constant";

//
// ---------- Types ----------
//
type SubjectOption = { _id: string; name: string };

type FormValues = {
  name: string;
  subject: SubjectOption | null;
  courses: string;
  description?: string;
};

const schema: yup.ObjectSchema<FormValues> = yup.object({
  name: yup.string().required("Name is required"),
  subject: yup
    .object({
      _id: yup.string().required(),
      name: yup.string().required(),
    })
    .nullable()
    .required("Subject is required"),
  courses: yup.string().required("Courses is required"),
  description: yup.string().optional(),
});

interface CourseEnquiryFormProps {
  id?: string;
  open: boolean;
  onClose: (result?: unknown) => void;
  payload?: Partial<FormValues> & { subject?: string };
}

//
// ---------- Component ----------
//
export default function CourseEnquiryForm({
  id,
  open,
  onClose,
  // payload,
}: CourseEnquiryFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    // setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      subject: null,
      courses: "",
      description: "",
    },
  });

  // initialize form on open
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

  // submit handler
  const onSubmit = async (data: FormValues) => {
    if (!data.subject) return;

    const transformedData = { ...data, subject: data.subject._id };

    try {
      if (id && id !== "new") {
        await axios.put(`/api/course/course-enquiry/${id}`, transformedData);
      } else {
        await axios.post(`/api/course/course-enquiry`, transformedData);
      }
      reset();
      onClose(true);
    } catch (err) {
      console.error("Error saving course enquiry:", err);
    }
  };

  // invalid handler
  const onInvalid: SubmitErrorHandler<FormValues> = (errors) => {
    console.error("Form validation failed:", errors);
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {id === "new" ? "Create Course Enquiry" : "Edit Course Enquiry"}
      </DialogTitle>

      <form
        id="courseEnquiry-form"
        onSubmit={handleSubmit(onSubmit, onInvalid)}
      >
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Name */}
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Enquiry Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      InputLabelProps={{
                        shrink: true,
                        sx: { color: "primary.main" },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Subject */}
              <Grid item xs={12}>
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <SubjectAutocomplete
                      {...field}
                      error={!!errors.subject}
                      helperText={errors.subject ? "Subject is required" : ""}
                      label="Subject"
                      placeholder="Search for a subject..."
                    />
                  )}
                />
              </Grid>

              {/* Courses */}
              <Grid item xs={12}>
                <Controller
                  name="courses"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Courses"
                      fullWidth
                      error={!!errors.courses}
                      helperText={errors.courses?.message}
                      InputLabelProps={{
                        shrink: true,
                        sx: { color: "primary.main" },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description (Optional)"
                      fullWidth
                      multiline
                      rows={3}
                      InputLabelProps={{
                        shrink: true,
                        sx: { color: "primary.main" },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => onClose(false)}>Cancel</Button>
          <Button type="submit" form="courseEnquiry-form" variant="contained">
            {id === "new" ? "Create" : "Update"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
