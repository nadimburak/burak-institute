"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InferType } from "yup";
import axios from "axios";
import { useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import SubjectAutocomplete from "@/components/autocomplete/SubjectAutocomplete";

// Components (Inhe sahi path se import karein)
// import SubjectAutocomplete from "@/components/autocomplete/SubjectAutocomplete";
// import CoursesAutocomplete from "@/components/autocomplete/CourseAutocomplete"; // ✅ Course Autocomplete ko bhi import karein

// ✅ Schema ko component ke bahar rakhein
const schema = yup.object({
  username: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  subject: yup
    .object()
    .shape({
      _id: yup.string().required(),
      name: yup.string(),
    })
    .nullable()
    .required("Subject is required"),
  courses: yup
    .object()
    .shape({
      _id: yup.string().required(),
      name: yup.string(),
    })
    .nullable()
    .required("Course is required"),
  description: yup.string().optional(),
});

type FormValues = InferType<typeof schema>;

interface CourseEnquiryFormProps {
  id?: string; // ID optional hai, "new" ke case mein nahi hoga
  open: boolean;
  onClose: (result?: boolean) => void;
}

export default function CourseEnquiryForm({
  id,
  open,
  onClose,
}: CourseEnquiryFormProps) {
  const isEditMode = id && id !== "new";

  // ✅ Sahi Default Values
  const defaultValues: FormValues = {
    username: "",
    email: "",
    subject: null,
    courses: null,
    description: "",
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const subject = watch("subject");
  const course = watch("courses");

  // ✅ Data fetching logic ko form ke andar manage karein
  useEffect(() => {
    // Form khulne par hi action lein
    if (open) {
      if (isEditMode) {
        // Edit mode: ID se data fetch karein
        axios
          .get(`/api/course/course-enquiry/${id}`)
          .then((res) => {
            reset(res.data.data); // Data aane par form ko populate karein
          })
          .catch((err) => console.error("Failed to fetch enquiry data:", err));
      } else {
        // Create mode: Form ko default values se reset karein
        reset(defaultValues);
      }
    }
  }, [id, isEditMode, open, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      // ✅ Data ko API ke liye sahi format mein transform karein
      const transformedData = {
        ...data,
        subject: data.subject?._id,
        courses: data.courses?._id,
      };

      if (isEditMode) {
        await axios.put(`/api/course/course-enquiry/${id}`, transformedData);
      } else {
        await axios.post(`/api/course/course-enquiry`, transformedData);
      }
      onClose(true); // Success par dialog band karein aur list refresh karein
    } catch (err) {
      console.error("Error saving course enquiry:", err);
      onClose(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? "Edit Course Enquiry" : "Create Course Enquiry"}
      </DialogTitle>

      <form id="courseEnquiry-form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              {/* ✅ Grid item ka sahi istemal */}
              <Grid item xs={12}>
                {/* ✅ Field ka naam 'username' karein */}
                <TextField
                  label="Username"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      color: "primary.main",
                    },
                  }}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  {...register("username")}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="email"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      color: "primary.main",
                    },
                  }}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register("email")}
                />
              </Grid>

              <Grid item xs={12}>
                <SubjectAutocomplete
                  setValue={setValue}
                  fullWidth
                  value={subject}
                  error={!!errors.subject}
                  helperText={errors.subject ? "Subject is required" : ""}
                />
              </Grid>

              <Grid item xs={12}>
                <CoursesAutocomplete
                  setValue={setValue}
                  fullWidth
                  value={course}
                  error={!!errors.courses}
                  helperText={errors.courses ? "Course is required" : ""}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="description"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      color: "primary.main",
                    },
                  }}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  {...register("description")}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => onClose(false)}>Cancel</Button>
          <Button type="submit" variant="contained">
            {isEditMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
