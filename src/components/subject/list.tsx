'use client';

import axiosInstance from '@/utils/axiosInstance';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Icon,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    useTheme,
} from '@mui/material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { useDialogs, useNotifications } from '@toolpad/core';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import useSWR, { mutate } from 'swr';

import CourseTypeForm from './form';
import { handleErrorMessage } from '@/utils/errorHandler';
import { getFetcher } from '@/utils/fetcher';
import { fetchUrl } from './constant';
import SubjectForm from './form';

export default function SubjectList() {
    const router = useRouter();
    const theme = useTheme();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [searchText, setSearchText] = useState('');
    const notifications = useNotifications();
    const dialogs = useDialogs();

    // Build query params
    const params = useMemo(() => {
        const searchParams = new URLSearchParams();
        searchParams.append('page', (paginationModel.page + 1).toString());
        searchParams.append('limit', paginationModel.pageSize.toString());
        if (searchText) searchParams.append('search', searchText);
        if (sortModel?.[0]) {
            searchParams.append('sortBy', sortModel[0].field);
            searchParams.append('order', sortModel[0].sort ?? '');
        }
        return searchParams.toString();
    }, [paginationModel, searchText, sortModel]);

    // Fetch data
    const { data, error, isLoading } = useSWR(`${fetchUrl}?${params}`, getFetcher);

    if (error && (error as any).status === 403) router.push('/forbidden');

    // Delete
    const handleDelete = useCallback(
        async (id: string) => {
            const confirmed = await dialogs.confirm('Are you sure to delete this?', { okText: 'Yes', cancelText: 'No' });
            if (!confirmed) return;

            try {
                const res = await axiosInstance.delete(`${fetchUrl}/${id}`);
                mutate(`${fetchUrl}?${params}`, { revalidate: true });
                notifications.show(res.data.message, { severity: 'success', autoHideDuration: 3000 });
            } catch (err: any) {
                notifications.show(handleErrorMessage(err), { severity: 'error', autoHideDuration: 3000 });
            }
        },
        [dialogs, notifications, params]
    );

    // Edit
    const handleEdit = useCallback(
        async (id: string) => {
            const result = await dialogs.open((props) => <SubjectForm {...props} id={id} />);
            if (result) mutate(`${fetchUrl}?${params}`, { revalidate: true });
        },
        [dialogs, params]
    );

    // Add new
    const handleAdd = useCallback(async () => {
        const result = await dialogs.open((props) => <SubjectForm {...props} id="new" />);
        if (result) mutate(`${fetchUrl}?${params}`, { revalidate: true });
    }, [dialogs, params]);

    // Columns
    const columns: GridColDef[] = useMemo(
        () => [
            { field: 'name', headerName: 'Name', width: 200 },
            { field: 'status', headerName: 'Status', width: 120 },
            {
                field: 'actions',
                headerName: 'Actions',
                width: 120,
                renderCell: (params) => (
                    <>
                        <IconButton onClick={() => handleEdit(params.row._id)} color="primary">
                            <Icon>edit</Icon>
                        </IconButton>
                        <IconButton onClick={() => handleDelete(params.row._id)} color="secondary">
                            <Icon>delete</Icon>
                        </IconButton>
                    </>
                ),
            },
        ],
        [handleDelete, handleEdit]
    );

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <p>Error loading data!</p>
            </Box>
        );
    }

    return (
        <Card>
            <CardContent>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            placeholder="Search Subject"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Icon>search</Icon>
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton
                                sx={{
                                    backgroundColor: theme.palette.action.hover,
                                    '&:hover': { backgroundColor: theme.palette.action.selected },
                                }}
                                onClick={() => mutate(`${fetchUrl}?${params}`, { revalidate: true })}
                            >
                                <Icon>refresh</Icon>
                            </IconButton>
                            <Button variant="contained" color="primary" onClick={handleAdd} endIcon={<ChevronRightIcon />}>
                                New Subject
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
            </CardContent>
        </Card>
    );
}
