"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Grid,
    Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { ICourse } from "@/models/course/Course.model";

interface CourseTypeFormProps {
    id?: string;
    open: boolean;
    onClose: (result?: unknown) => void;
    payload?: any;
}

// ✅ Validation Schema
const schema = yup.object({
    name: yup.string().required("Course name is required"),
    subject: yup.string().required("Subject is required"),
    duration: yup.string().required("Duration is required"),
    image: yup.string().url("Invalid URL").required("Image URL is required"),
    description: yup.string().optional(),
});

export default function CourseTypeForm({
    id,
    open,
    onClose,
    payload,
}: CourseTypeFormProps) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ICourse>({
        resolver: yupResolver(schema),
        defaultValues: payload || {}, // preload when editing
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
    const onSubmit = async (data: ICourse) => {
        try {
            if (id && id !== "new") {
                // update existing
                const res = await axios.put(`/api/course/${id}`, data);
                console.log("Course updated:", res.data);
            } else {
                // create new
                const res = await axios.post(`/api/course`, data);
                console.log("Course created:", res.data);
            }
            reset();
            onClose(true); // close dialog after success
        } catch (err) {
            console.error("Error saving course:", err);
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{id === "new" ? "Create Course" : "Edit Course"}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <form id="course-form" onSubmit={handleSubmit(onSubmit)}>
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
                            <Grid size={{ xs: 12 }}>
                                <SubjectAutocomplete />
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
                        </Grid>
                    </form>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)}>Cancel</Button>
                <Button type="submit" form="course-form" variant="contained">
                    {id === "new" ? "Create" : "Update"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
