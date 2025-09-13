"use client";

import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

type SubjectOption = { id: string; name: string };

type Props = {
    value: SubjectOption | SubjectOption[] | null;
    onChange: (value: SubjectOption | SubjectOption[] | null) => void;
    label?: string;
    placeholder?: string;
    multiple?: boolean;
    disabled?: boolean;
    limit?: number; // server-side limit
};

export default function SubjectAutocomplete({
    value,
    onChange,
    label = "Subject",
    placeholder = "Search subjects…",
    multiple = false,
    disabled,
    limit = 10,
}: Props) {
    const [inputValue, setInputValue] = React.useState("");
    const [options, setOptions] = React.useState<SubjectOption[]>([]);
    const [loading, setLoading] = React.useState(false);

    // debounced server search
    React.useEffect(() => {
        const controller = new AbortController();
        const t = setTimeout(async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    q: inputValue,
                    limit: String(limit),
                });
                const res = await fetch(`/api/subject?${params}`, {
                    signal: controller.signal,
                    cache: "no-store",
                });
                if (!res.ok) throw new Error("Failed to load subjects");
                const data: SubjectOption[] = await res.json();
                setOptions(data);
            } catch (e) {
                if ((e as unknown as { name?: string }).name !== "AbortError") {
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
        <Autocomplete<SubjectOption, boolean, false, false>
            multiple={multiple}
            disabled={disabled}
            options={options}
            value={value as unknown as SubjectOption | SubjectOption[] | null}
            onChange={(_, v) => onChange(v)}
            onInputChange={(_, v) => setInputValue(v)}
            getOptionLabel={(o) => o?.name ?? ""}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            loading={loading}
            filterOptions={(x) => x} // disable client filter, only server
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
