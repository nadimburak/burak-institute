"use client";
import { useSearchParams } from "next/navigation";
import {Box,Typography} from '@mui/material'
import Image from "next/image"
import ContactForm from '@/components/form/courseEnqiryFrom'

const page = () => {

   const searchParams = useSearchParams();
   const subject = searchParams.get('subject')
   const duration = searchParams.get('duration')
   const name = searchParams.get('name')
   const image = searchParams.get('image')
   const description = searchParams.get('description')
   const createdAt = searchParams.get('createdAt')
   const updatedAt = searchParams.get('updatedAt')
  return (
    <Box height="100vh" width="100vw"  display="flex">
      <Box height="90%" width="50%" display="flex" justifyContent="center" alignItems='center' flexDirection='column'>
        <Box>
          <Image height={300} width={650} alt="image" src={"/1.png"}/>
        </Box>
        <Typography variant="h1">{name}subject</Typography>
        <Typography variant="h2">{subject} subject</Typography>
        <Typography variant="h4">{duration}subject</Typography>
        <Typography variant="h6">{description}subject</Typography>
        <Typography variant="body1">{createdAt}subject</Typography>
        <Typography variant="body1">{updatedAt}subject</Typography>
      </Box>
      <Box height="100%" width="50%" >
    <ContactForm/>
      </Box>
      </Box>
    
  )
}

export default page
