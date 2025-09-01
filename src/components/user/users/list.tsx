"use client";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridMoreVertIcon,
  GridSortModel,
} from "@mui/x-data-grid";
import { useDialogs, useNotifications } from "@toolpad/core";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import UserForm from "./form";
import UpdateProfilePassword from "./update-password";
import UserView from "./view";
import { fetchUserUrl, updatePasswordUrl, viewUrl } from "./constant";
import { getFetcher } from "@/utils/fetcher";
import axiosInstance from "@/utils/axiosInstance";
import { handleErrorMessage } from "@/utils/errorHandler";

interface ActionsCellProps {
  row: unknown;
  handleEdit: (id: string) => void;
  handleView: (id: number) => void;
  handlePassword: (id: unknown) => void;
  handleDelete: (id: string) => void;
}

function ActionsCell({
  row,
  handleEdit,
  handleView,
  handlePassword,
  handleDelete,
}: ActionsCellProps) {
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

export default function UserList() {
  const router = useRouter();
  const notifications = useNotifications();
  const dialogs = useDialogs();
  const theme = useTheme();


  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [searchText, setSearchText] = useState("");

  // Build query string for page, sort, search
  const params = useMemo(() => {
    const searchParams = new URLSearchParams();

    searchParams.append("page", (paginationModel.page + 1).toString());
    searchParams.append("limit", paginationModel.pageSize.toString());
    if (searchText) searchParams.append("search", searchText);
    if (sortModel[0]) {
      searchParams.append("sort", sortModel[0].field);
      searchParams.append("order", sortModel[0].sort ?? "");
    }
    return searchParams.toString();
  }, [paginationModel, sortModel, searchText]);


  // Column definitions
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        width: 120,
        renderCell: (params) => (
          <ActionsCell
            row={params.row}
            handleEdit={handleEdit}
            handleView={handleView}
            handlePassword={handlePassword}
            handleDelete={handleDelete}
          />
        ),
      },
      {
        field: "role",
        headerName: "Role",
        width: 200,
        renderCell: (params) => {
          const isCustomer = params?.row?.type === "customer";
          const roleName = params?.row?.role?.name;

          // Customer without role
          if (isCustomer && !roleName) {
            return (
              <Chip
                label="No Role Assigned"
                color="info" // Customer special color
                sx={{
                  textTransform: "capitalize",
                  backgroundColor: "#f5f5f5",
                  color: "#1976d2",
                  fontWeight: 500,
                }}
              />
            );
          }

          // Default role chip
          return (
            <Chip
              label={roleName || "N / A"}
              color="primary"
              sx={{ textTransform: "capitalize", px: 1 }}
            />
          );
        },
      },
      {
        field: "type",
        headerName: "Type",
        width: 170,
        renderCell: (params) => {
          const typeMap = {
            user: {
              label: "User",
              color: "warning",
              icon: <PersonIcon />,
            },
            super_admin: {
              label: "Super Admin",
              color: "secondary",
              icon: <SecurityIcon />,
            },
            customer: {
              label: "Customer",
              color: "info", // Alag color customer ke liye
              icon: <EmojiPeopleIcon />,
            },
          };

          const typeValue = params?.row?.type as keyof typeof typeMap;
          const { label, color, icon } = typeMap[typeValue] || {
            label: "N / A",
            color: "default",
            icon: null,
          };

          return (
            <Chip
              icon={icon}
              label={label}
              color={color as unknown}
              sx={{ textTransform: "capitalize", px: 1, fontWeight: "bold" }}
            />
          );
        },
      },
      {
        field: "image",
        headerName: "Profile",
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <Box
              component="img"
              src={
                params?.row?.image
                  ? `/uploads/${params?.row?.image}`
                  : "/avatar.jpg"
              }
              alt="Document"
              sx={{
                width: 40,
                height: 40,
                borderRadius: "8px",
                objectFit: "cover",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            />
          </Box>
        ),
      },
      { field: "name", headerName: "Name", width: 200 },
      { field: "email", headerName: "Email", width: 250 },
    ],
    [handleEdit, handleView, handlePassword, handleDelete]
  );

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <p>Error loading users.</p>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid size={{ md: 6, sm: 6, xs: 12 }}>
              <TextField
                placeholder="Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon>search</Icon>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                }}
              />
            </Grid>
            <Grid size={{ md: 6, sm: 6, xs: 12 }}>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="flex-end"
                width="100%"
              >
                <IconButton
                  sx={{
                    backgroundColor: theme.palette.action.hover,
                    "&:hover": {
                      backgroundColor: theme.palette.action.selected,
                    },
                  }}
                  aria-label="edit"
                  color="secondary"
                  onClick={() => mutate(`${fetchUserUrl}?${params.toString()}`)}
                >
                  <Icon>refresh</Icon>
                </IconButton>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    textTransform: "none",
                    width: { xs: "100%", sm: "auto" },
                  }}
                  onClick={() => handleAdd()}
                  endIcon={<ChevronRightIcon fontSize="small" />}
                >
                  New User
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Card>
            <Box height={500}>
              <DataGrid
                rows={data?.data || []}
                columns={columns}
                rowCount={data?.total || 0}
                paginationMode="server"
                sortingMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onSortModelChange={setSortModel}
                getRowId={(row) => row._id}
              />
            </Box>
          </Card>
        </Box>
      </CardContent>
    </Card>
  );
}
