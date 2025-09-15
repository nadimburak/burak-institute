"use client"
import {useRouter} from 'next/navigation'
import {useSatate, useMemo, useCallback} from "react";
import useSWR, {mutate} from 'swr'
import {handleErrorMessage} from "@/utils/errorHandler"
import {getFetcher} from '@/utils/fetcher'
import {useDialogs, useNotifications} from "@toolapad/core"

const CourseEnquiryList = () => {

  const router = useRouter();
  const theme = useTheme();
  const [paginationModel, setPaginationModel] = useState({})
  return (
    <div>
      
    </div>
  )
}

export default CourseEnquiryList
