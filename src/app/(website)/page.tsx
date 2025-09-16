"use client";

import { Box, Button, Chip, Stack, Typography, useTheme } from "@mui/material";
import CoursePage from "./courses/page";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

// import './styles.css';

// import required modules
import { Navigation } from "swiper/modules";

export default function MainPage() {
  const theme = useTheme(); // 🎨 theme se colors lena
  const features = [
    "Peer learning",
    "Code reviews",
    "Virtual hostel",
    "Doubt sessions",
    "Bounties",
  ];

  const slides =[
    {id:1, image:"/slider-image/education-1.jpg", alt:""},

    {id:2, image:"/slider-image/education-2.png", alt:"",},
    {id:3, image:"/slider-image/education-1.png", alt:""},

    {id:4, image:"/slider-image/education-1.png", alt:""}
  ]

  return (
    <>
      <Box>
        <Swiper navigation={true} modules={[Navigation]} className="mySwiper"
          style={{height:'500px'}}
        >
           {slides.map((slide) => (
      <SwiperSlide key={slide.id}>
        <img
          src={slide.image}
          alt={slide.alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </SwiperSlide>
    ))}
        </Swiper>
      </Box>
      <CoursePage />
    </>
  );
}
