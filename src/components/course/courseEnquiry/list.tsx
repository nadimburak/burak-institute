"use client"
import {useRouter} from 'next/navigation'
import {useState, useMemo, useCallback} from "react";
import useSWR, {mutate} from 'swr'
import {handleErrorMessage} from "@/utils/errorHandler"
import {getFetcher} from '@/utils/fetcher'
import {useDialogs, useNotifications} from "@toolpad/core"
import axiosInstance from "@/utils/axiosInstance"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import {DataGrid,GridColDef, GridSortModel} from "@mui/x-data-grid"
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
  useTheme
} from "@mui/material"
import { fetchUrl } from "./constant";



const CourseEnquiryList = () => {

  const router = useRouter();
  const theme = useTheme();
  const [paginationModel, setPaginationModel] = useState({
    page:0,
    pageSize:10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([])
  const [searchText, setSearchText]=useState("")
  const notifications = useNotifications();
  const dialogs = useDialogs();

  const params = useMemo(()=>{
    const searchParams = new URLSearchParams();
    searchParams.append("page",(paginationModel.page+1).toString())
    searchParams.append("limit", paginationModel.pageSize.toString())
    
    if(searchText) searchParams.append("search",searchText)
      if(sortModel?.[0]){
        searchParams.append('sortBy',sortModel[0].field)
        searchParams.append('order',sortModel[0].sort ?? "")
      }
      return searchParams.toString();
  },[paginationModel,searchText,sortModel]);

  const {data, error, isLoading}= useSWR(`${fetchUrl}?${params}`,getFetcher)

  if(
    error && typeof error === "object" && error !==null && "status" in error && typeof (error as {status?:unknown}).status === "number" && (error as {status: number}).status === 403
  ){
    router.push("/forbidden")
  }

  const handleDelete = useCallback(
    async (id:string) =>{
      const confirmed = await dialogs.confirm("Are you sure to delete this?",{
        okText:"Yes",
        cancelText:"No"
      });

      if(!confirmed) return

      try{
        const res = await axiosInstance.delete(`${fetchUrl}/${id}`);
        mutate(`${fetchUrl}?${params}`,{revalidate:true})
        notifications.show(res.data.message,{
          severity:"success",
          autoHideDuration:3000,
        })
      }catch(error:unknown){
        notifications.show(handleErrorMessage(error),{
          severity:'error',
          autoHideDuration:3000,
        })
      }
    },[dialogs,notifications,params]
  )

  const handleEdit = useCallback()
  return (
    <div>
      
    </div>
  )
}

export default CourseEnquiryList
