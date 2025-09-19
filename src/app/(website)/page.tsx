"use client";

import { Box, Button, Chip, Stack, Typography, useTheme } from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

// import './styles.css';

// import required modules
import { Autoplay, Navigation } from "swiper/modules";
import CoursesCard from "@/components/web/courses/courseCard";
import CoursesList from "@/components/web/courses/list";
import Image from "next/image";

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
    {id:3, image:"/slider-image/education-3.jpg", alt:""},
    {id:4, image:"/slider-image/education-4.jpg", alt:"", }
  ]

  return (
    <>
      <Box>
        <Swiper modules={[Autoplay]} 
        autoplay={{
          delay:2000,
          disableOnInteraction: false
        }}
        loop={true}
        spaceBetween={30}
        slidesPerView={1}
        className="mySwiper"
        style={{height:'500px'}}
        
        >
           {slides.map((slide) => (
      <SwiperSlide key={slide.id}>
        <Image
          src={slide.image || "/10.png"}
          alt={slide.alt}
          width={1200}
          height={500}
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
      
    <CoursesList /> 
    </>
  );
}
