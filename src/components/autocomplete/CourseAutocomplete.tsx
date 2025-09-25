"use client";

import { getFetcher } from "@/utils/fetcher";
import { Box, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import useSWR from "swr";

interface CoursestOption {
  _id: string;
  name: string;
}

interface CoursesAutocompleteProps {
  setValue: unknown;
  value: CoursestOption | null;
  helperText?: string;
  error?: boolean;
  fullWidth: unknown;
}

const CoursesAutocomplete: React.FC<CoursesAutocompleteProps> = ({
  setValue,
  value,
  helperText = "",
  error = false,
  fullWidth,
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
          Error fetching subjects
        </Typography>
      </Box>
    );
  }

  return (
    <Autocomplete
      options={data?.data || []}
      getOptionLabel={(option: CoursestOption) => option?.name || ""}
      isOptionEqualToValue={(o, v) => o._id === v._id}
      loading={isLoading}
      fullWidth={fullWidth}
      onChange={(_, selected) => {
        setValue("courses", selected, { shouldValidate: true });
      }}
      value={value ?? null} // ✅ always null instead of undefined
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Course"
          variant="outlined"
          helperText={helperText}
          error={error}
          fullWidth={fullWidth}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setSearchText(e.target.value)}
        />
      )}
    />
  );
};

export default CoursesAutocomplete;
