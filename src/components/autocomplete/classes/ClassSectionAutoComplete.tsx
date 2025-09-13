"use client";
import { getFetcher } from "@/utils/fetcher";
import { Box, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import useSWR from "swr";

interface ClassItem {
  _id: string;
  name: string;
}

interface ClassesAutocompleteProps {
  setValue: any;
  value: any;
  helperText?: string;
  error?: boolean;
}

const ClassSectionAutocomplete: React.FC<ClassSectionAutocompleteProps> = (props) => {
  const fetchUrl = "/class-section";
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
          Error fetching classes
        </Typography>
      </Box>
    );
  }

  return (
    <Autocomplete
      options={data?.data || []}
      getOptionLabel={(option: ClassItem) => option.name || ""}
      isOptionEqualToValue={(option: ClassItem, value: ClassItem) =>
        option._id === value._id
      }
      loading={isLoading}
      onChange={(_, data) => {
        setValue(
          "class",
          { _id: data?._id, name: data?.name },
          {
            shouldValidate: true,
          }
        );
      }}
      value={value}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Class"
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

export default ClassesAutocomplete;
