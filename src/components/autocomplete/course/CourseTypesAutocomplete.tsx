"use client";
import { getFetcher } from "@/utils/fetcher";
import { Box, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import useSWR from "swr";

interface CourseTypeItem {
  _id: string;
  name: string;
}

interface CourseTypeAutocompleteProps {
  setValue: (
    name: "course_type",
    value: { _id: string; name: string } | null,
    config?: { shouldValidate: boolean }
  ) => void;
  value: CourseTypeItem | null;
  helperText?: string;
  error?: boolean;
}

const CourseTypeAutocomplete: React.FC<CourseTypeAutocompleteProps> = (
  props
) => {
  const fetchUrl = "course/course-types";
  const [searchText, setSearchText] = useState("");
  const { setValue, value, helperText = "", error = false } = props;

  // Build query params
  const params = new URLSearchParams();
  if (searchText) {
    params.append("search", searchText);
  }
  params.append("page", "1");
  params.append("limit", "10");

  // Fetch with SWR
  const {
    data,
    error: isError,
    isLoading,
  } = useSWR(`${fetchUrl}?${params.toString()}`, getFetcher);

  if (isError) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Error fetching course types
        </Typography>
      </Box>
    );
  }

  return (
    <Autocomplete
      options={data?.data || []}
      getOptionLabel={(option: CourseTypeItem) => option.name || ""}
      isOptionEqualToValue={(option, val) => option._id === val._id}
      loading={isLoading}
      value={value ?? null}
      onChange={(_, selected) => {
        setValue(
          "course_type",
          selected ? { _id: selected._id, name: selected.name } : null,
          { shouldValidate: true }
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Course Type"
          variant="outlined"
          margin="normal"
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

export default CourseTypeAutocomplete;
