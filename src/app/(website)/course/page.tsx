"use client";

import { getFetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { fetchUrl } from "@/components/course/courses/constant"
import {
  Box,
  Grid,
  Typography,

} from "@mui/material";
import CoursesCard, { CourseModel } from "@/components/web/courses/courseCard";

const Page = () => {
  const { data, error } = useSWR(`${fetchUrl}`, getFetcher);


  if (error) {
    return <div>Error loading Courses</div>;
  }

  const courses = data?.data || [];


  return (
    <>
      {courses.length === 0 ? (
        <Box mt={4} textAlign="center" width="100%">
          <Typography variant="h6" color="text.primary">
            No Courses Found
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {courses.map((course: CourseModel, index: number) => (
              <Grid key={`course-${index}`} size={{ xs: 12, md: 3, sm: 6 }}>
                <CoursesCard data={course} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </>
  )
};

export default Page;
