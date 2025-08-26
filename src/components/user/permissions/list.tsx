"use client";

import axiosInstance from "@/utils/axiosInstance";
import BusinessIcon from "@mui/icons-material/Business";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
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
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useDialogs, useNotifications } from "@toolpad/core";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import { fetchUrl } from "./constant";
import PermissionForm from "./form";
import { handleErrorMessage } from "@/utils/errorHandler";
import { getFetcher } from "@/utils/fetcher";

export default function PermissionList() {
  const router = useRouter();
  const theme = useTheme();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [searchText, setSearchText] = useState("");
  const notifications = useNotifications();
  const dialogs = useDialogs();

  // Build the query string for pagination, sorting, and search
  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", (paginationModel.page + 1).toString());
    searchParams.append("limit", paginationModel.pageSize.toString());

    if (searchText) {
      searchParams.append("search", searchText);
    }

    if (sortModel?.[0]) {
      searchParams.append("sort", sortModel[0].field);
      searchParams.append("order", sortModel[0].sort ?? "");
    }

    return searchParams.toString(); // Return a string to use as a stable key
  }, [paginationModel, searchText, sortModel]);

  // Fetch data with SWR
  const { data, error, isLoading } = useSWR(
    `${fetchUrl}?${params.toString()}`,
    getFetcher
  );

  useEffect(() => {
    if (error && error.status == 403) {
      router.push("/forbidden");
    }
  }, [error, router]);

  // Handle deletion of a row
  const handleDelete = useCallback(
    async (id: number) => {
      const confirmed = await dialogs.confirm("Are you sure to delete this ?", {
        okText: "Yes",
        cancelText: "No",
      });

      if (confirmed) {
        try {
          const response = await axiosInstance.delete(`${fetchUrl}/${id}`);
          // Revalidate the data after deleting the category
          mutate(`${fetchUrl}?${params.toString()}`, { revalidate: true });

          const { data } = response;
          notifications.show(data.message, {
            severity: "success",
            autoHideDuration: 3000,
          });
        } catch (error: unknown) {
          const message = handleErrorMessage(error);
          notifications.show(message, {
            severity: "error",
            autoHideDuration: 3000,
          });
        }
      }
    },
    [dialogs, notifications, params]
  );
  // Handle editing of a row
  const handleEdit = useCallback(
    async (id: number) => {
      const result = await dialogs.open((props) => (
        <PermissionForm {...props} id={id} />
      ));
      if (result) {
        mutate(`${fetchUrl}?${params.toString()}`, { revalidate: true });
      }
    },
    [dialogs, params]
  );

  // Handle new
  const handleAdd = async () => {
    const result = await dialogs.open((props) => (
      <PermissionForm {...props} id="new" />
    ));
    if (result) {
      mutate(`${fetchUrl}?${params.toString()}`, { revalidate: true });
    }
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "actions",
        headerName: "Action",
        type: "actions",
        width: 100,
        renderCell: (params) => (
          <>
            <IconButton
              onClick={() => handleEdit(params.row._id)}
              aria-label="edit"
              color="primary"
            >
              <Icon>edit</Icon>
            </IconButton>
            <IconButton
              onClick={() => handleDelete(params.row._id)}
              aria-label="delete"
              color="secondary"
            >
              <Icon>delete</Icon>
            </IconButton>
          </>
        ),
      },
      {
        field: "company",
        headerName: "Company",
        width: 200,
        renderCell: (params) => {
          const hasCompany = !!params?.row?.company?.name;
          return (
            <Chip
              icon={hasCompany ? <BusinessIcon /> : <SecurityIcon />}
              label={hasCompany ? params.row.company.name : "Super Admin Role"}
              color={hasCompany ? "primary" : "secondary"}
            />
          );
        },
      },
      { field: "name", headerName: "Name", width: 200 },
    ],
    [handleDelete, handleEdit]
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
        <p>Error loading data!</p>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box>
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Grid size={{ md: 6, sm: 6, xs: 12 }}>
              <TextField
                placeholder="Search Permission"
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
                  onClick={() => mutate(`${fetchUrl}?${params.toString()}`)}
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
                  New Permission
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Box height={400}>
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
        </Box>
      </CardContent>
    </Card>
  );
}
