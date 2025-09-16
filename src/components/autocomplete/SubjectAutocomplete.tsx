"use client";

import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

// API se aane wale data ka asli format
type SubjectFromAPI = {
  _id: string; // Underscore ke saath
  name: string;
};

// Component mein use hone wala standard format
type SubjectOption = {
  id:string; // Bina underscore ke
  name: string;
};

// API response ka poora format
type ApiResponse = {
  data: SubjectFromAPI[];
};

type Props = {
    value: SubjectOption | null;
    onChange: (value: SubjectOption | null) => void;
    label?: string;
    placeholder?: string;
    multiple?: boolean; // multiple prop ko handle karne ke liye code rakha gaya hai
    disabled?: boolean;
    limit?: number;
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
    const [options, setOptions] = React.useState<readonly SubjectOption[]>([]);
    const [loading, setLoading] = React.useState(false);

    // ✅ FIX 1: Edit mode mein value dikhane ke liye
    const allOptions = React.useMemo(() => {
        const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
        const uniqueOptions = new Map<string, SubjectOption>();
        selectedValues.forEach(val => val && uniqueOptions.set(val.id, val));
        options.forEach(opt => uniqueOptions.set(opt.id, opt));
        return Array.from(uniqueOptions.values());
    }, [options, value]);

    // Aapka purana setTimeout wala structure
    React.useEffect(() => {
        const controller = new AbortController();
        const t = setTimeout(async () => {
            // Jab tak user type na kare, API call na karein
            if (inputValue === "") {
              setOptions([]);
              return;
            }
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

                const json: ApiResponse = await res.json();

                // ✅ FIX 2: API se aaye data ko sahi format mein laane ke liye
                // Isse '.filter' aur 'id' validation, dono error theek honge
                const transformedData = (json.data || []).map(item => ({
                  id: item._id, // _id ko 'id' banaya
                  name: item.name,
                }));
                
                setOptions(transformedData);

            } catch (e) {
                if ((e as Error).name !== "AbortError") {
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
        <Autocomplete
            multiple={multiple}
            disabled={disabled}
            options={allOptions} // Yahan 'allOptions' ka istemal karein
            value={value}
            onChange={(_, v) => onChange(v as any)}
            onInputChange={(_, v) => setInputValue(v)} // Aapka purana onInputChange
            getOptionLabel={(o) => o?.name ?? ""}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            loading={loading}
            filterOptions={(x) => x}
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