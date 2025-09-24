"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  CircularProgress

} from "@mui/material";
import useSWR from "swr";
import { getFetcher } from "@/utils/fetcher"
import { fetchUrl } from "@/components/course/courses/constant"
import CouserEnquiryForm from "@/components/form/courseEnqiryFrom"
// import CouserEnquiryForm from '@/components/form/courseEnquiryFrom'

const CourseEnquiryUserForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  // const img = searchParams.get("image");

  const CourseData = searchParams.get("data")

  let CourseInfo: any = null

  try {
    CourseInfo = CourseData ? JSON.parse(CourseData) : null;
  } catch (err) {
    console.error("Invalid course data in URL", err);
  }




  if (!CourseInfo) {
    return <Typography color="error">No course data found</Typography>;
  }


  const ImgaeUrl: string = `/uploads/${CourseInfo.image}`


  return (
    <Box
    
      sx={{
        gap: 2,
        minHeight: '80vh',
        maxWidth: '100vw',
        display: "flex",
          justifyContent: "center",
          alignItems: "center",
           flexDirection: "column",
      }}
    >
      <Card
        sx={{
          height: "80vh",
          maxWidth: "100vw",
          margin: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
         
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            height: "80%",
            width: '100%',
            alignItems: "center",
            
           gap:2
          }}
           

        >
          <Box height="100%" width="100%" display={"flex"} justifyContent={"center"}  alignItems={"center"}>
            <Box height="100%" width="100%" component="img" borderRadius={"20px"} src={ImgaeUrl}></Box>
          </Box>


          <Box height="100%" width="100%" display={"flex"} flexDirection={"column"} borderRadius={"20px"} bgcolor={"#232c3bff"} gap={3} justifyContent={"center"}  alignItems={"center"}>
          <Typography color="white" variant="h2" width='80%' textAlign='center' m={1}>
           Name:  {`${CourseInfo?.name}`}
          </Typography>
          <Typography color="white" width='80%' textAlign='center'  m={1} variant="h3">
            {`Sub: ${CourseInfo.subject.name}`}
          </Typography>

          <Typography color="white" variant="h6">
            duration: {`${CourseInfo.duration}`}
          </Typography>
          <Typography color="white" variant="body1" width={"75%"} m={2}>
            {`${CourseInfo.description}`}
          </Typography>
          </Box>

        </CardContent>

         
        <CardActions>
          <Button 
            sx={{ paddingRight: "60px", paddingLeft:'60px', paddingTop:'8px', color:'white', paddingBottom:'8px', bgcolor: "#232c3bff" }}
            onClick={() => {
              router.push(`/`);
            }}
          >
            Back
          </Button>
        </CardActions>
      </Card>
      <Typography variant="h1" width={"100%"} textAlign={'center'} m={4}>Course-Enquiry Form</Typography>
       <CouserEnquiryForm/>
    </Box>

   
  );
};

export default CourseEnquiryUserForm;
