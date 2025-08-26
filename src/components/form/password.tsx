import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface PasswordInputErrors {
    password?: {
        type?: string;
        message?: string;
    };
}

interface PasswordInputProps {
    errors: PasswordInputErrors;
    value: unknown;
    setValue: (value: string) => void;
    fullWidth?: boolean;
    label?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = (props) => {
    const { errors, value, setValue, fullWidth, label } = props;
    const [showPassword, setShowPassword] = useState(false);

    return (
        <TextField
            fullWidth={fullWidth}
            label={label}
            margin="normal"
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            error={!!errors.password}
            InputLabelProps={{ shrink: true }}
            helperText={
                errors.password?.type === "required"
                    ? errors.password.message
                    : errors.password?.type === "matches"
                        ? "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character."
                        : ""
            }
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    )
}

export default PasswordInput;