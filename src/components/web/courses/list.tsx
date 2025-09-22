"use client";

import { getFetcher } from "@/utils/fetcher";
import { FilterAltOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Drawer,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import useSWR from "swr";

import { fetchUrl } from "../../course/courses/constant"; // yaha apni API base URL dalna
import CoursesCard, { CourseModel } from "./courseCard";
import { ICourse } from "@/models/course/Course.model";
import { useRouter } from "next/navigation";

interface CoursesListProps {
  title?: string;
}

const CoursesList: React.FC<CoursesListProps> = ({ title }) => {
  const [sortOption, setSortOption] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchText, setSearchText] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const router = useRouter();

  // Sort options
  const sortOptions = [
    { value: "", label: "Default" },
    { value: "name", label: "Name" },
    { value: "createdAt", label: "Date Posted" },
    { value: "duration", label: "Duration" },
  ];

  // Build query string
  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (searchText) searchParams.append("search", searchText);
    if (sortOption) {
      searchParams.append("sort", sortOption);
      searchParams.append("order", sortDirection);
    }
    return searchParams.toString();
  }, [sortOption, sortDirection, searchText]);

  // Fetch courses data
  const { data, error, isLoading } = useSWR(
    `${fetchUrl}?${params}`,
    getFetcher
  );

  if (error) {
    return <div>Error loading Courses</div>;
  }

  // Courses data
  const courses = data?.data || [];

  return (
    <Box mt={2} mb={2} px={{ xs: 2, sm: 4, md: 6 }}>
      <Typography
        sx={{ textAlign: "center" }}
        mt={5}
        mb={2}
        component="h2"
        variant="h4"
        fontWeight={700}
      >
        Some of Our Popular Courses
      </Typography>

      {/* Sort + Filter */}
      <Box
        mt={4}
        mb={2}
        display="flex"
        gap={2}
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="flex-end"
      >
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOption}
              onChange={(event: SelectChangeEvent) =>
                setSortOption(event.target.value)
              }
              label="Sort By"
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button onClick={() => setOpenFilter(true)}>
            Filter
            <FilterAltOutlined sx={{ fontSize: "17px", ml: "5px" }} />
          </Button>
        </Box>
      </Box>

      {/* Course List */}
      {courses.length === 0 ? (
        <Box mt={4} textAlign="center" width="100%">
          <Typography variant="h6" color="text.secondary">
            No Courses Found
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {courses.slice(0, 4).map((course: CourseModel, index: number) => (
              <Grid key={`course-${index}`} size={{ xs: 12, md: 3, sm: 6 }}>
                <CoursesCard data={course} />
              </Grid>
            ))}
          </Grid>

          {/* View More Button */}
          <Box mt={4} textAlign="center">
            <Button
              variant="contained"
              sx={{
                borderRadius: 2,
                fontWeight: 500,
                padding: "8px 16px",
                fontSize: "16px",
              }}
              onClick={() => router.push("/courses")}
            >
              View All Courses
            </Button>
          </Box>
        </>
      )}

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={openFilter}
        onClose={() => setOpenFilter(false)}
      >
        <Box padding={2} width={250}>
          <Typography variant="h6">Filters</Typography>
          {/* Yaha courseType / subject filters add karoge later */}
        </Box>
      </Drawer>
    </Box>
  );
};

export default CoursesList;
