import {Card,CardContent,Typography,CardActions,Button} from "@mui/material"
import Image from "next/image"
import { useRouter } from "next/navigation"


const CourseCard = (props:any) => {
    const {subject,duration,name,image,description,createdAt,updatedAt} = props
    const router = useRouter()
  return (
    <Card>
        <CardContent>
            <Typography>
                <Image height={100} width={100} src={`${image || ""}`} alt="image"/>
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
            <button onClick={()=>{router.push("/");}}></button>
        </CardActions>
    </Card>
  )
}

export default CourseCard
