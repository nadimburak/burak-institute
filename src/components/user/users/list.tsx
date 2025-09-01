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

  const { data, error, isLoading } = useSWR(
    `${fetchUserUrl}?${params}`,
    getFetcher
  );

  // Redirect on 403
  useEffect(() => {
    if (error?.status === 403) router.push("/forbidden");
  }, [error, router]);

  // Delete handler
  const handleDelete = useCallback(
    async (id: string) => {
      const ok = await dialogs.confirm(
        "Are you sure you want to delete this?",
        {
          okText: "Yes",
          cancelText: "No",
        }
      );
      if (!ok) return;

      try {
        const res = await axiosInstance.delete(`${fetchUserUrl}/${id}`);
        mutate(`${fetchUserUrl}?${params}`, { revalidate: true });
        notifications.show(res.data.message, {
          severity: "success",
          autoHideDuration: 3000,
        });
      } catch (error: unknown) {
        const errorMessage = handleErrorMessage(error);
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 3000,
        });
      }
    },
    [dialogs, notifications, params]
  );

  // Edit handler
  const handleEdit = useCallback(
    async (id: string) => {
      const result = await dialogs.open((props) => (
        <UserForm {...props} id={id} />
      ));
      if (result) mutate(`${fetchUserUrl}?${params}`, { revalidate: true });
    },
    [dialogs, params]
  );

  // Add handler
  const handleAdd = useCallback(async () => {
    const result = await dialogs.open((props) => (
      <UserForm {...props} id="new" />
    ));
    if (result) mutate(`${fetchUserUrl}?${params}`, { revalidate: true });
  }, [dialogs, params]);

  const handleView = async (id: number) => {
    const result = await dialogs.open((props) => (
      <UserView {...props} id={id} />
    ));
    if (result) {
      mutate(`${viewUrl}?${params.toString()}`);
    }
  };

  const handlePassword = useCallback(
    async (id: any) => {
      const result = await dialogs.open((props) => (
        <UpdateProfilePassword {...props} id={id} />
      ));
      if (result) {
        mutate(`${updatePasswordUrl}?${params.toString()}`);
      }
    },
    [dialogs, params]
  );

  // Column definitions
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        width: 120,
        renderCell: (params) => {
          const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
          const [selectedId, setSelectedId] = useState<number | null>(null);

          const handleClick = (
            event: React.MouseEvent<HTMLElement>,
            id: number
          ) => {
            setAnchorEl(event.currentTarget);
            setSelectedId(id);
          };

          const handleClose = () => {
            setAnchorEl(null);
          };

          return (
            <>
              <IconButton
                onClick={(e) => handleClick(e, params.row.id)}
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
                    handleEdit(params.row._id);
                    handleClose();
                  }}
                >
                  <Icon sx={{ color: "primary.main", mr: 1 }}>edit</Icon> Edit
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleView(params.row._id);
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
                    handlePassword(params.row._id);
                    handleClose();
                  }}
                >
                  <Icon sx={{ color: "success.main", mr: 1 }}>lock</Icon> Update
                  Password
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleDelete(params.row._id);
                    handleClose();
                  }}
                >
                  <Icon sx={{ color: "error.main", mr: 1 }}>delete</Icon>
                  Delete
                </MenuItem>
              </Menu>
            </>
          );
        },
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
              color={color as any}
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
    [handleEdit, handleDelete]
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
