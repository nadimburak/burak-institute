import { ErrorComponent } from "@/components/form/errorComponent";
import { UserModel } from "@/models/User.model";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import useSWR from "swr";
import { fetchUserUrl } from "./constant";
import { getFetcher } from "@/utils/fetcher";

interface MultiUserAutocompleteProps {
  type?: string;
  setValue: (value: UserModel[]) => void;
  value: UserModel[] | null;
  error?: boolean;
  helperText?: string;
}

const MultiUserAutocomplete: React.FC<MultiUserAutocompleteProps> = (props) => {
  const { setValue, value = [], helperText = "", error = false, type } = props;
  const [searchText, setSearchText] = useState("");

  // Build the query string for pagination, sorting, and search
  const params = new URLSearchParams();
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
  } = useSWR(`${fetchUserUrl}?${params.toString()}`, getFetcher);

  if (isError) {
    return <ErrorComponent title="Error fetching data" />;
  }

  return (
    <Autocomplete
      multiple
      options={(data?.data || []).filter((user: UserModel) => user?.type === "user")}
      getOptionLabel={(option: UserModel) => `${option?.name}`}
      isOptionEqualToValue={(option, val) => option._id === val._id}
      loading={isLoading}
      value={Array.isArray(value) ? value : []}
      onChange={(_, selectedOptions) => {
        setValue(Array.isArray(selectedOptions) ? selectedOptions : []);
      }}
      renderOption={(props, option) => (
        <li {...props} key={option._id}>
          {`${option?.name}`}
        </li>
      )}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label="Select Users"
            variant="outlined"
            fullWidth
            error={!!error}
            helperText={helperText}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        );
      }}
    />
  );
};

export default MultiUserAutocomplete;
