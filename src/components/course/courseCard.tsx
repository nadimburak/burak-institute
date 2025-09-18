'use client'

import { Card, CardContent, Typography, CardActions, Button, Box } from "@mui/material"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getFetcher } from '@/utils/fetcher'
import { useState, useEffect } from "react"

const CourseCard = () => {

    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                let res = await getFetcher('/course/courses')

                let result = res.json ? await res.json() : res
                console.log(result);


                setData(result.data || [])

            } catch (error: unknown) {
                console.error(error)
                setData([])
            }
        }
        fetchData()
    }, [])

    // const {subject,duration,name,image,description,createdAt,updatedAt} = props


    const router = useRouter()

    return (
        <Box sx={{
            height: '150vh',
            width: '100vw',
            border: '2px solid red',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2
        }}>
            {data.map((value: any, index) => (
                <Card key={index} sx={{
                    height: '80vh',
                    width: '25vw',
                    margin: '10px',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'
                }}>
                    <CardContent sx={{ display: 'flex', height:'80%', alignItems: 'center', flexDirection: 'column' }}>
                      
                        <Box><Image height={150} width={320} style={{ margin:'3px' }} src={`/uploads/${value.image}`} alt="image" /></Box>
                        <Typography color="white" variant="h2">
                            {value.name}
                        </Typography>
                        <Typography color="white" variant="h3">
                            {value.subject.name}
                        </Typography>
                        <Typography color="white" variant="h6">
                            {value.duration}
                        </Typography>
                        <Typography sx={{height:'40%', width:'85%', margin:'5px'}} color="white" variant="body1">
                            {value.description}
                        </Typography>
                        {/* <Typography>
                {value.createdAt}{value.updatedAt}
            </Typography> */}
                    </CardContent>
                    <CardActions>
                        <Button sx={{padding:'12px', bgcolor:'gray'}} onClick={() => { router.push(`/courseEnqury?name=${value.name}&image=${value.image}&subject=${value.subject.name}&duration=${value.duration}&description=${value.description}&createdAt=${value.createdAt}&updatedAt=${value.updatedAt}`); }}>Explore</Button>
                    </CardActions>
                </Card>
            ))}


        </Box>
    )
}

export default CourseCard
