import { getFetcher } from "@/utils/fetcher";
import { Box, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import useSWR from "swr";
import { fetchUrl } from "./constant";
import { IRole } from "@/models/Role";

interface RoleAutocompleteProps {
  setValue: any;
  value: any | null;
  helperText?: string | undefined;
  error?: boolean;
  watch?: any;
  trigger: any;
}

const RoleAutocomplete: React.FC<RoleAutocompleteProps> = (props) => {
  const { setValue, value, helperText = "", error = false, trigger } = props;
  const [searchText, setSearchText] = useState("");
  // Build the query string for pagination, sorting, and search
  const params = new URLSearchParams();
  // Add search parameter if searchText is not empty
  if (searchText) {
    params.append("search", searchText);
  }
  const {
    data,
    error: isError,
    isLoading,
  } = useSWR(`${fetchUrl}?${params.toString()}`, getFetcher);

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
      options={data?.data || []}
      getOptionLabel={(option: IRole) => option.name || ""}
      getOptionKey={(option: IRole) => option._id.toString()}
      loading={isLoading}
      onChange={(_, data) => {
        setValue("role", { _id: data?._id, name: data?.name });
        trigger("role");
      }}
      value={value || null}
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{ shrink: true }}
          label="Select Role"
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

export default RoleAutocomplete;
