import { IconButton } from "@mui/material";
import { useState } from "react";
import {
    GridMoreVertIcon,
} from "@mui/x-data-grid";
import { Menu, MenuItem, Icon } from "@mui/material";

interface RowData {
    _id: string;
    // add other properties if needed
}

interface ActionsCellProps {
    row: RowData;
    handleEdit: (id: string) => void;
    handleView: (id: string) => void;
    handlePassword: (id: string) => void;
    handleDelete: (id: string) => void;
}

export const ActionsCell = ({
    row,
    handleEdit,
    handleView,
    handlePassword,
    handleDelete,
}: ActionsCellProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                aria-label="more"
                color="default"
            >
                <GridMoreVertIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={() => {
                        handleEdit(row._id);
                        handleClose();
                    }}
                >
                    <Icon sx={{ color: "primary.main", mr: 1 }}>edit</Icon> Edit
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        handleView(row._id);
                        handleClose();
                    }}
                >
                    <Icon sx={{ color: "secondary.main", mr: 1 }}>
                        visibility
                    </Icon>
                    View
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handlePassword(row._id);
                        handleClose();
                    }}
                >
                    <Icon sx={{ color: "success.main", mr: 1 }}>lock</Icon> Update
                    Password
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        handleDelete(row._id);
                        handleClose();
                    }}
                >
                    <Icon sx={{ color: "error.main", mr: 1 }}>delete</Icon>
                    Delete
                </MenuItem>
            </Menu>
        </>
    );
}