"use client";
import { getFetcher } from "@/utils/fetcher";
import { Box, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import useSWR from "swr";

interface CourseItem {
  _id: string;
  name: string;
}

interface CoursesAutocompleteProps {
  setValue: (
    name: "course", 
    value: { _id: string; name: string } | null,
    config?: { shouldValidate: boolean }
  ) => void;
  value: CourseItem | null;
  helperText?: string;
  error?: boolean;
}

const CoursesAutocomplete: React.FC<CoursesAutocompleteProps> = (props) => {
  const fetchUrl = "/course/courses"; 
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
          Error fetching courses
        </Typography>
      </Box>
    );
  }

  return (
    <Autocomplete
      options={data?.data || []} 
      getOptionLabel={(option: CourseItem) => option.name || ""}
      isOptionEqualToValue={(option, val) => option._id === val._id}
      loading={isLoading}
      value={value ?? null}
      onChange={(_, selected) => {
        setValue(
          "course", 
          selected ? { _id: selected._id, name: selected.name } : null,
          { shouldValidate: true }
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Course"
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

export default CoursesAutocomplete;
