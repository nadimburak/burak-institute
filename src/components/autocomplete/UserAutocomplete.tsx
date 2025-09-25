import { Box, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import useSWR from "swr";

interface CompanyUser {
  _id: string;
  name: string;
  type?: string;
}
interface CompanyUserAutocompleteProps {
  type?: string;
  setValue: (
    name: "company_user",
    value: CompanyUser | null,
    config?: { shouldValidate: boolean }
  ) => void;
  value: CompanyUser | null;
  helperText?: string | undefined;
  error?: boolean;
  watch?: unknown;
}

const CompanyUserAutocomplete: React.FC<CompanyUserAutocompleteProps> = (
  props
) => {
  const fetchUrl = "user/users";
  const { setValue, value, helperText = "", error = false, type } = props;
  const [searchText, setSearchText] = useState("");
  // Build the query string for pagination, sorting, and search
  const params = new URLSearchParams();
  // Add search parameter if searchText is not empty
  if (searchText) {
    params.append("search", searchText);
  }

  if (type) {
    params.append("type", type);
  }
  const {
    data,
    error: isError,
    isLoading,
  } = useSWR(`${fetchUrl}?${params.toString()}`);

  if (isError) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Error fetching data
        </Typography>
      </Box>
    );
  }

  return (
    <Autocomplete
      options={(data?.data || []).filter(
        (user: CompanyUser) => user?.type === "user"
      )}
      getOptionLabel={(option: CompanyUser) =>
        option?.name || option.name || ""
      }
      isOptionEqualToValue={(option, val) => option._id === val._id}
      getOptionKey={(option: CompanyUser) => option._id.toString()}
      loading={isLoading}
      onChange={(_, data) => {
        setValue("company_user", data, { shouldValidate: true });
      }}
      value={value || null}
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{ shrink: true }}
          label="Select Company User"
          variant="outlined"
          helperText={helperText}
          error={error}
          fullWidth
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
      )}
    />
  );
};

export default CompanyUserAutocomplete;
