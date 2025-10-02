"use client";

import { getFetcher } from "@/utils/fetcher";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  InputAdornment,
  Icon,
} from "@mui/material";
import React, { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import useSWR from "swr";

interface CourseOption {
  _id: string;
  name: string;
}

interface CourseFormValues {
  courses: CourseOption | null;
}

interface CourseAutocompleteProps {
  setValue: any;
  value: CourseOption | null;
  helperText?: string;
  error?: boolean;
  fullWidth: any;
}

const CourseAutocomplete: React.FC<CourseAutocompleteProps> = ({
  setValue,
  fullWidth,
  value,
  helperText = "",
  error = false,
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
      onInputChange={(_, newInputValue) => setSearchText(newInputValue)}
      onChange={(_, selected) => {
        setValue("courses", selected, { shouldValidate: true });
      }}
      value={value ?? null} // ✅ safe fallback
      fullWidth={fullWidth}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Course"
          variant="outlined"
          helperText={helperText}
          error={error}
          fullWidth={fullWidth}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="end">
                <Icon>search</Icon>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

export default CourseAutocomplete;
