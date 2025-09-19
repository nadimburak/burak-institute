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
} from "@mui/material";
// import CouserEnquiryForm from '@/components/form/courseEnquiryFrom'

const CourseEnquiryUserForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const img = searchParams.get("image");

  return (
    <Box
      sx={{
        gap: 2,
      }}
    >
      <Card
        sx={{
          height: "80%",
          width: "50%",
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
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box>
            <Image
              height={150}
              width={320}
              style={{ margin: "3px" }}
              src={`/uploads/${img}`}
              alt="image"
            />
          </Box>
          <Typography color="white" variant="h2">
            {searchParams.get("name")}
          </Typography>
          <Typography color="white" variant="h2">
            {searchParams.get("subject")}
          </Typography>

          <Typography color="white" variant="body1">
            {searchParams.get("description")}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            sx={{ padding: "12px", bgcolor: "gray" }}
            onClick={() => {
              router.push(`/`);
            }}
          >
            Back
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default CourseEnquiryUserForm;
