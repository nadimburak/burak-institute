"use client";

import { Box, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import * as y from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotifications } from "@toolpad/core";
import SubjectAutocomplete from "@/components/autocomplete/SubjectAutocomplete";
import CourseEnquiryType from "@/models/course/courseEnqiryFrom";
import { fetchUrl } from "@/components/course/courses/constant";
import axios from "axios"; // or your custom axiosInstance

// ✅ Yup schema
export const formDataSchema = y.object({
  name: y.string().min(1, "Name is required!!!"),
  description: y
    .string()
    .min(2, "Description is required and must be greater than 2 characters"),
  course: y.string().min(2, "Course is required !!!"),
  subject: y
    .object({
      _id: y.string().required("Subject is required"),
    })
    .nullable()
    .required("Subject is required"),
});

interface CourseInquiryType {
  id?: string;
  open: boolean;
  onClose: (result?: unknown) => void;
  payload?: any;
}

export default function ContactForm({
  id,
  open,
  onClose,
  payload,
}: CourseInquiryType) {
  const notifications = useNotifications();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CourseEnquiryType>({
    resolver: yupResolver(formDataSchema),
    defaultValues: payload || {
      name: "",
      subject: null,
      course: "",
      description: "",
    },
  });

  const subject = watch("subject");

  // ✅ submit handler
  const onSubmit = async (data: CourseEnquiryType) => {
    data["subject"] = subject?._id;

    let url = `${fetchUrl}`;
    let method: "post" | "put" = "post";

    if (id !== "new") {
      url = `${fetchUrl}/${id}`;
      method = "put";
    }

    try {
      const res = await axios.request({
        url,
        method,
        data,
      });

      if (res.status === 200 || res.status === 201) {
        notifications.show(res.data.message, { severity: "success" });
        onClose("true");
      }
    } catch (error: any) {
      console.error("Axios Error: ", error);

      const message =
        error?.response?.data?.message ||
        JSON.stringify(error?.response?.data) ||
        "An unexpected error occurred";

      notifications.show(message, { severity: "error" });
      onClose("true");
    }
  };

  // ✅ fetch existing data if edit
  useEffect(() => {
    if (id && id !== "new") {
      bindData(id);
    }
  }, [id]);

  const bindData = async (id: string | number) => {
    try {
      const response = await axios.get(`/api/course/course-enquiry/${id}`);
      reset(response.data.data);
      setValue("subject", response.data.data.subject);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const styles = {
    width: 500,
    "& .MuiOutlinedInput-root": {
      transition: "box-shadow 0.3s ease",
      "&:hover fieldset": {
        border: "none",
        boxShadow: "2px 2px 20px 2px #7C3AED",
        transition: "box-shadow 0.3s ease",
      },
      "&.Mui-focused": {
        boxShadow: "2px 2px 10px 2px #7C3AED",
      },
    },
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)} // ✅ hook form submit
      height={5 * 100}
      width={50 * 12}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        mt: 10,
        ml: 5,
      }}
    >
      {/* Name */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            required
            label="Name"
            variant="outlined"
            size="medium"
            sx={styles}
            placeholder="Your Name"
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />
        )}
      />

      {/* Course */}
      <Controller
        name="course"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Course"
            variant="outlined"
            size="medium"
            sx={styles}
            error={Boolean(errors.course)}
            helperText={errors.course?.message}
          />
        )}
      />

      {/* Subject */}
      <SubjectAutocomplete
        setValue={setValue}
        value={subject}
        error={!!errors.subject}
        helperText={errors.subject ? "Subject is required" : ""}
      />

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={5}
            maxRows={20}
            sx={styles}
            type="text"
            placeholder="Description"
            error={Boolean(errors.description)}
            helperText={errors.description?.message}
          />
        )}
      />

      <Button
        type="submit"
        variant="outlined"
        disabled={isSubmitting || loading}
        sx={{
          padding: "10px",
          paddingLeft: "50px",
          paddingRight: "50px",
          color: "white",
          fontWeight: "400",
          fontSize: "1.2rem",
          border: "1px solid  #7C3AED",
        }}
      >
        Submit
      </Button>
    </Box>
  );
}
