"use client";

import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

type RoleOption = { id: string; name: string; };

type Props = {
    value: RoleOption | RoleOption[] | null;
    onChange: (value: RoleOption | RoleOption[] | null) => void;
    label?: string;
    placeholder?: string;
    multiple?: boolean;
    disabled?: boolean;
    limit?: number;
};

export default function RoleAutocomplete({
    value,
    onChange,
    label = "Role",
    placeholder = "Search roles…",
    multiple = false,
    disabled,
    limit = 10,
}: Props) {
    const [inputValue, setInputValue] = React.useState("");
    const [options, setOptions] = React.useState<RoleOption[]>([]);
    const [loading, setLoading] = React.useState(false);

    // debounced search
    React.useEffect(() => {
        const controller = new AbortController();
        const t = setTimeout(async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    q: inputValue,
                    limit: String(limit),
                });
                const res = await fetch(`/api/roles?${params}`, {
                    signal: controller.signal,
                    cache: "no-store",
                });
                if (!res.ok) throw new Error("Failed to load roles");
                const data: RoleOption[] = await res.json();
                setOptions(data);
            } catch (e) {
                if ((e).name !== "AbortError") {
                    console.error(e);
                    setOptions([]);
                }
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            controller.abort();
            clearTimeout(t);
        };
    }, [inputValue, limit]);

    return (
        <Autocomplete<RoleOption, boolean, false, false>
            multiple={multiple}
            disabled={disabled}
            options={options}
            value={value as unknown as RoleOption | RoleOption[] | null}
            onChange={(_, v) => onChange(v)}
            onInputChange={(_, v) => setInputValue(v)}
            getOptionLabel={(o) => o?.name ?? ""}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            loading={loading}
            filterOptions={(x) => x} // use server filtering, not client
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}
