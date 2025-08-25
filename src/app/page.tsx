"use client"
import { Box, Stack, Typography } from "@mui/material";
import "./page.module.css"
import Buttons from "@/components/admin/users/WebPage/button";
export default function Home() {
  return (
    <>

      <Box sx={{ height: "99vh", width: "99vw", display: "flex", justifyContent: "center" }}>
        <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "65%" }}>
          <Typography component="h1" variant="h2">Consistency and Community</Typography>
          <Typography component="p" variant="h5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur id libero cum, consequatur veniam architecto modi aliquid minima ducimus debitis.</Typography>

          <Stack direction="row" spacing={2}>
            <Buttons text="Annocment" backgroundColor="white" color="black" border="1px solid black" borderRadius="13px" padding="6px" fontSize="1.3rem" />
            <Buttons text="Events" backgroundColor="white" color="black" border="1px solid black" borderRadius="13px" padding="6px" fontSize="17.3rem" />
          </Stack>
        </Box>
      </Box>
    </>
  );
}
