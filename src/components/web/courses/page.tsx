import React from "react";
import {getFetcher} from '@/utils/fetcher'
import CourseCard from '@/components/course/courseCard'
import useSWR from "swr";
import type {ICourse} from '@/models/course/Course.model'
import { Box ,Typography} from "@mui/material";

export const CourseContant = async ()=>{
// const data:Array<ICourse>= await getFetcher('/api/course/courses/')

const {data, error, isLoading }=useSWR<ICourse[]>("/api/course/courses", getFetcher);



if (isLoading) return <Typography>Loading...</Typography>;
if (error) return <Typography>Error loading courses</Typography>;

if (!data || data.length === 0) {
    return (
      <Box>
        <Typography>No courses available. Please check back later.</Typography>
      </Box>
    );
  }

return (
  <Box>
{data.map((course)=>(<CourseCard key={course._id} value={course}/> ))}
    
  </Box>
)
}
