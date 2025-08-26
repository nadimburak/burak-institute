import { Box, FormControlLabel, Switch } from "@mui/material"
import { useState } from "react"
import { Popover, Typography } from "@mui/material"

interface ToggleSelectProps {
    value: boolean;
    setValue: (checked: boolean) => void;
    popup?: boolean;  // Make it optional
    popupText?: string;
    label: string;
}

const ToggleSelect: React.FC<ToggleSelectProps> = ({
    value,
    setValue,
    label,
    popup = false,
    popupText = ""
}) => {
    const [anchorAdminEl, setAnchorAdminEl] = useState<HTMLElement | null>(null);
    const openAdminPopOver: boolean = Boolean(anchorAdminEl);

    const handleAdminPopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorAdminEl(event.currentTarget);
    };

    const handleAdminPopoverClose = () => {
        setAnchorAdminEl(null);
    };

    return (
        <Box>
            <FormControlLabel
                control={
                    <Switch
                        checked={value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setValue(e.target.checked)
                        }}
                        color="primary"
                    />
                }
                label={label}

                aria-owns={openAdminPopOver ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handleAdminPopoverOpen}
                onMouseLeave={handleAdminPopoverClose}
            />

            {popup && <Popover
                id="mouse-over-popover"
                sx={{ pointerEvents: 'none' }}
                open={openAdminPopOver}
                anchorEl={anchorAdminEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handleAdminPopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1 }}>
                    {popupText}
                </Typography>
            </Popover>}
        </Box >
    )
}

export default ToggleSelect