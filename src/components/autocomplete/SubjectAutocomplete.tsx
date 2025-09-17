"use client";

import { getFetcher } from "@/utils/fetcher";
import { Box, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import useSWR from "swr";

interface SubjectOption {
    _id: any;
    name: string;
}

interface SubjectAutocompleteProps {
    setValue: any;
    value: SubjectOption | null;
    helperText?: string;
    error?: boolean;
}

const SubjectAutocomplete: React.FC<SubjectAutocompleteProps> = ({
    setValue,
    value,
    helperText = "",
    error = false,
}) => {
    const fetchUrl = "/subject";

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
                    Error fetching subjects
                </Typography>
            </Box>
        );
    }

    return (
        <Autocomplete
            options={data?.data || []}
            getOptionLabel={(option: SubjectOption) => option?.name || ""}
            isOptionEqualToValue={(o, v) => o._id === v._id}
            loading={isLoading}
            onChange={(_, selected) => {
                setValue("subject", selected, { shouldValidate: true });
            }}
            value={value ?? null} // ✅ always null instead of undefined
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Select Subject"
                    variant="outlined"
                    fullWidth
                    helperText={helperText}
                    error={error}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            )}
        />
    );
};

export default SubjectAutocomplete;
