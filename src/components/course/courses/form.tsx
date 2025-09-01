"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    TextField,
    Button,
    MenuItem,
    Grid,
    Box,
    Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

// ✅ Validation Schema
const schema = yup.object({
    name: yup.string().required("Course name is required"),
    subject: yup.string().required("Subject is required"),
    duration: yup.string().required("Duration is required"),
    image: yup.string().url("Invalid URL").required("Image URL is required"),
    description: yup.string().optional(),
});

type CourseFormData = yup.InferType<typeof schema>;

export default function CourseForm() {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CourseFormData>({
        resolver: yupResolver(schema),
    });

    const [subjects, setSubjects] = useState<{ _id: string; name: string }[]>([]);

    // ✅ Fetch subjects for dropdown
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await axios.get("/api/subject");
                setSubjects(res.data.data || []);
            } catch (err) {
                console.error("Failed to fetch subjects", err);
            }
        };
        fetchSubjects();
    }, []);

    // ✅ Submit Handler
    const onSubmit = async (data: CourseFormData) => {
        try {
            const res = await axios.post("/api/course", data);
            console.log("Course created:", res.data);
            reset();
        } catch (err) {
            console.error("Error creating course:", err);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
            <Typography variant="h5" gutterBottom>
                Create Course
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    {/* Course Name */}
                    <Grid item xs={12}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Course Name"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                    </Grid>

                    {/* Subject Dropdown */}
                    <Grid item xs={12}>
                        <Controller
                            name="subject"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Select Subject"
                                    fullWidth
                                    error={!!errors.subject}
                                    helperText={errors.subject?.message}
                                >
                                    {subjects.map((sub) => (
                                        <MenuItem key={sub._id} value={sub._id}>
                                            {sub.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>

                    {/* Duration Dropdown */}
                    <Grid item xs={12}>
                        <Controller
                            name="duration"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Duration"
                                    fullWidth
                                    error={!!errors.duration}
                                    helperText={errors.duration?.message}
                                >
                                    <MenuItem value="3 months">3 Months</MenuItem>
                                    <MenuItem value="6 months">6 Months</MenuItem>
                                    <MenuItem value="12 months">12 Months</MenuItem>
                                </TextField>
                            )}
                        />
                    </Grid>

                    {/* Image URL */}
                    <Grid item xs={12}>
                        <Controller
                            name="image"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Image URL"
                                    fullWidth
                                    error={!!errors.image}
                                    helperText={errors.image?.message}
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
                                />
                            )}
                        />
                    </Grid>

                    {/* Submit */}
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" fullWidth>
                            Create Course
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
