"use client";
import { getFetcher } from "@/utils/fetcher";
import { Box, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import useSWR from "swr";

interface ClassesItem {
  _id: string;
  name: string;
}

interface ClassesAutocompleteProps {
  setValue: any;
  value: any;
  helperText?: string;
  error?: boolean;
  watch:any
}

const ClassesAutocomplete: React.FC<ClassesAutocompleteProps> = (props) => {
  const fetchUrl = "/classes";
  const [searchText, setSearchText] = useState("");
  const { setValue, value, helperText = "", error = false ,watch} = props;

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
          Error fetching classes
        </Typography>
      </Box>
    );
  }

  return (
   <Autocomplete
  options={data?.data || []}
  getOptionLabel={(option: ClassesItem) => option.name || ""}
  isOptionEqualToValue={(option, val) => option._id === val._id}
  loading={isLoading}
  value={value ?? null}         // 👈 yeh ensure karega ki kabhi undefined nahi hoga
  onChange={(_, selected) => {
    setValue(
      "class",
      selected ? { _id: selected._id, name: selected.name } : null,
      { shouldValidate: true }
    );
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Class"
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
}
export default ClassesAutocomplete;
