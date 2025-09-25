"use client";

import React, { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import useSWR from "swr";
import { getFetcher } from "@/utils/fetcher";

//
// ---------- Types ----------
//
export interface SubjectOption {
  _id: string;
  name: string;
}

export interface SubjectAutocompleteProps {
  value: SubjectOption | null;
  onChange: (newValue: SubjectOption | null) => void;
  onBlur?: () => void;
  ref?: React.Ref<HTMLInputElement>; // ✅ Instead of any
  helperText?: string;
  error?: boolean;
  fullWidth: any;
}

//
// ---------- Component ----------
//
const SubjectAutocomplete: React.FC<SubjectAutocompleteProps> = ({
  setValue,
  value,
  helperText = "",
  error = false,
  fullWidth,
}) => {
  const [searchText, setSearchText] = useState("");

  // Build the query string
  const params = new URLSearchParams();
  if (searchText) params.append("search", searchText);

  // Fetch data using SWR
  const {
    data,
    error: isError,
    isLoading,
  } = useSWR(`/subject?${params.toString()}`, getFetcher);

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
      fullWidth={fullWidth}
      onChange={(_, selected) => {
        setValue("subject", selected, { shouldValidate: true });
      }}
      value={value ?? null} // ✅ always null instead of undefined
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Subject"
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

export default SubjectAutocomplete;
