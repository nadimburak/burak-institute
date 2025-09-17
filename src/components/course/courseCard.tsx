'use client'

import {Card,CardContent,Typography,CardActions,Button} from "@mui/material"
import Image from "next/image"
import { useRouter } from "next/navigation"


const CourseCard = (props:any) => {
    const {subject,duration,name,image,description,createdAt,updatedAt} = props

    if([subject, duration,name,image,description].some((field)=>( String(field || "").trim()===""))){
        return (
           <Typography>Course Not Available...</Typography>
        )
    }
    const router = useRouter()
    
  return (
    <Card>
        <CardContent>
            <Typography>
                <Image height={100} width={100} src={`${image}`} alt="image"/>
            </Typography>
            <Typography>
                {name}
            </Typography>
            <Typography>
                {subject}
            </Typography>
            <Typography>
                {duration}
            </Typography>
            <Typography>
                {description}
            </Typography>
            <Typography>
                {createdAt}{updatedAt}
            </Typography>
        </CardContent>
        <CardActions>
            <button onClick={()=>{router.push(`/courseEnqury?name=${name}&subject${subject}&duration=${duration}&image${image}&description${description}&createdAt${createdAt}&updatedAt${updatedAt}`);}}>Explore</button>
        </CardActions>
    </Card>
  )
}

export default CourseCard
