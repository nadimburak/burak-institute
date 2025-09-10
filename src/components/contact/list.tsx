'use client'
import {Box,
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
    useTheme,} from "@mui/material"
    import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState,useMemo, useCallback} from "react"
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { fetchUrl } from './constant';
import useSWR, { mutate } from 'swr';
import { getFetcher } from '@/utils/fetcher';
import { useRouter } from 'next/navigation';
import { useDialogs, useNotifications } from '@toolpad/core';
import axiosInstance from '@/utils/axiosInstance';
import { handleErrorMessage } from '@/utils/errorHandler';




const ContactList = () => {
  
  const theme = useTheme();
      const dialogs = useDialogs();
    const [searchText,setSearchText] = useState('')
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
      const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const router = useRouter();
 const notifications = useNotifications();


      const params = useMemo(()=>{
        const searchParams = new URLSearchParams()
        searchParams.append('page',(paginationModel.page+1).toString())
        searchParams.append('limit',paginationModel.pageSize.toString())
        if(searchText) searchParams.append('search',searchText);
        if(sortModel?.[0]){
            searchParams.append('sortBy', sortModel[0].field);
            searchParams.append('order',sortModel[0].sort ?? '')
        }
        return searchParams.toString()
      },[paginationModel,searchText,sortModel])

      const {data,error, isLoading}= useSWR(`${fetchUrl}?${params}`,getFetcher)

      if(
        error && 
        typeof error === 'object' && error !==null && 
        'status' in error && typeof (error as {status?:unknown}).status === 'number' && (error as {status:number}).status ==403
      ){
        router.push('/forbidden')
      }

      const handleDelete = useCallback(
        async (id:string) =>{
          const confirmed = await dialogs.confirm('Are you sure to delete this?',{okText: 'Yes', cancelText:'No'});
          if(!confirmed) return;

          try {
            const res = await axiosInstance.delete(`${fetchUrl}/${id}`)
            mutate(`${fetchUrl}?${params}`,{revalidate:true})
            notifications.show(res.data.message,{severity:'success',autoHideDuration:3000})
          } catch (error:unknown) {
            notifications.show(handleErrorMessage(error),{
              severity:'error', autoHideDuration:3000
            })
          }
        },
        [dialogs,notifications,params]
      )

      const columns: GridColDef[]=useMemo(()=>[
        {field:'name',headerName:'Name',width:200},
        {
          field:'actions',
          headerName:'Action',
          width:120,
          renderCell:(params)=>(
            <>
             <IconButton onClick={() => handleDelete(params.row._id)} color="secondary">
                            <Icon>delete</Icon>
                        </IconButton>
            </>
          )
        }
      ],[handleDelete])

      
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
               
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
                            slotProps={{
                                input:{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Icon>search</Icon>
                                    </InputAdornment>
                                ),}
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
  )
}

export default ContactList
