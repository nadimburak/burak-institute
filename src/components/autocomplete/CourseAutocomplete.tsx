"use client";

import { getFetcher } from "@/utils/fetcher";
import { Box, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import useSWR from "swr";

interface CourseOption {
    _id: any;
    name: string;
}

interface CourseAutocompleteProps {
    setValue: any;
    value: CourseOption | null;
    helperText?: string;
    error?: boolean;
}

const CourseAutocomplete: React.FC<CourseAutocompleteProps> = ({
    setValue,
    value,
    helperText = "",
    error = false,
    fullWidth
}) => {
    const fetchUrl = "/course/courses";

    const [searchText, setSearchText] = useState("");

    // Build the query string
    const params = new URLSearchParams();
    if (searchText) {
        params.append("search", searchText);
    }

    // Fetch data with SWR
    const {
        data,
        error: isError,
        isLoading,
    } = useSWR(`${fetchUrl}?${params.toString()}`, getFetcher);

    if (isError) {
        return (
            <Box>
                <Typography variant="h6" color="error">
                    Error fetching course
                </Typography>
            </Box>
        );
    }

    return (
        <Autocomplete
            options={data?.data || []}
            getOptionLabel={(option: CourseOption) => option?.name || ""}
            isOptionEqualToValue={(o, v) => o._id === v._id}
            loading={isLoading}
            fullWidth={fullWidth}
            onInputChange={(_, newInputValue) => {
            setSearchText(newInputValue);
        }}
            onChange={(_, selected) => {
                setValue("courses", selected, { shouldValidate: true });
            }}
            value={value ?? null} // ✅ always null instead of undefined
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Select  Course"
                    variant="outlined"
                    fullWidth={fullWidth}
                    helperText={helperText}
                    error={error}
                    InputLabelProps={{ shrink: true }}
                   
                />
            )}
        />
    );
};

export default CourseAutocomplete;
