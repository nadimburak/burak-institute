"use client";

import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Icon,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography,
    CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNotifications } from "@toolpad/core";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { ICourse } from "@/models/course/Course.model";
import SubjectAutocomplete from "@/components/autocomplete/SubjectAutocomplete";
import ImageUpload from "@/components/form/imageUpload";
import { defaultValues, fetchUrl } from "./constant";
import axiosInstance from "@/utils/axiosInstance";

interface CourseTypeFormProps {
    id?: string;
    open: boolean;
    onClose: (result?: unknown) => void;
    payload?: any;
}

// ✅ Validation Schema
const schema = yup.object({
    name: yup.string().required("Course name is required"),
    subject: yup
        .object({
            _id: yup.string().required("Subject is required"),
        })
        .nullable()
        .required("Subject is required"),
    duration: yup.string().required("Duration is required"),
    image: yup.string().required("Image is required"),
    description: yup.string().optional(),
});


export default function CourseForm({ id, open, onClose, payload }: CourseTypeFormProps) {
    const notifications = useNotifications();
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ICourse>({
        resolver: yupResolver(schema),
        defaultValues: payload || {
            name: "",
            subject: null,
            duration: "",
            image: "",
            description: "",
        },
    });

    const subject = watch("subject");
    const [loading, setLoading] = useState(false);

    // ✅ Submit Handler
    const onSubmit = async (data: ICourse) => {
        data["subject"] = subject?._id;

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
            if (response.status == 200 || response.status == 201) {
                notifications.show("Course created successfully", { severity: "success", autoHideDuration: 3000, });
                onClose("true");
            }
        } catch (error: unknown) {
            const err = error as AxiosErrorResponse;
            console.error("Axios Error:", err); // 👈 ye add karo

            if (err?.response?.data?.message) {
                notifications.show(err.response.data.message, { severity: "error" });
            } else if (err?.response?.data) {
                notifications.show(JSON.stringify(err.response.data), { severity: "error" });
            } else {
                notifications.show("An unexpected error occurred", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
            }
            onClose("true");
        }

    };

    useEffect(() => {
        if (id && id !== "new") {
            bindData(id);
        }
    }, [id]);

    const bindData = async (id: string | number) => {
        try {
            const response = await axios.get(`/api/course/${id}`);
            reset(response.data.data);
            setValue("subject", response.data.data.subject);
        } catch (error) {
            console.error("Error fetching course:", error);
        }
    };

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={() => onClose(null)}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography variant="h6">
                            {id === "new" ? "Create Course" : "Edit Course"}
                        </Typography>
                        <IconButton onClick={() => onClose(null)}>
                            <Icon>close</Icon>
                        </IconButton>
                    </Stack>
                </DialogTitle>

                <DialogContent>
                    <Grid container spacing={2} mt={1}>
                        {/* Course Name */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Course Name"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                {...register("name")}
                            />
                        </Grid>

                        {/* Subject */}
                        <Grid size={{ xs: 12 }}>
                            <SubjectAutocomplete
                                setValue={setValue}
                                value={subject}
                                error={!!errors.subject}
                                helperText={errors.subject ? "Subject is required" : ""}
                            />
                        </Grid>
                        {/* Duration */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                select
                                label="Duration"
                                fullWidth
                                defaultValue=""
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.duration}
                                helperText={errors.duration?.message}
                                {...register("duration")}
                            >
                                <MenuItem value="3 months">3 Months</MenuItem>
                                <MenuItem value="6 months">6 Months</MenuItem>
                                <MenuItem value="12 months">12 Months</MenuItem>
                            </TextField>
                        </Grid>

                        {/* Image Upload */}
                        <Grid size={{ xs: 12 }}>
                            <ImageUpload
                                value={watch("image")}
                                maxFileSize="10MB"
                                setValue={(val) => setValue("image", val, { shouldValidate: true })}
                                error={!!errors.image}
                                helperText={errors.image?.message}
                            />
                        </Grid>

                        {/* Description */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                {...register("description")}
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
                </DialogContent>
            </form>
        </Dialog>
    );
}
