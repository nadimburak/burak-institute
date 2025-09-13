'use client'

import { Box, Typography, Link} from "@mui/material";


 const AddressField =()=>{
    return (
        <Box   sx={{
        border:'1px solid #7C3AED',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        // boxShadow:'2px 2px 20px 2px #7C3AED',
        borderRadius:'10px',
        gap:1,
        mt:10,
        ml:5,
         "&:hover": {
                        // border: '2px solid #7C3AED',
                        border:'none',
                        boxShadow: '2px 2px 30px 4px #7C3AED',
                         transition: "box-shadow 0.6s ease",
                    },
        }}
        height={250} width={600}>
        <Typography variant="h3" sx={{fontSize:'1.7rem'}} >
            We would love to hear from you!
        </Typography>
        
        <Typography variant="h6" sx={{fontSize:'1rem', fontWeight:'100'}} >
         Please fill out the form below to get in touch with us.
        </Typography>

        <Link href="mailto:info.burakit@gmail.com" underline="hover">
      info.burakit@gmail.com
      </Link>
        <Link href="tel:+919876543210" underline="hover">+91 8003402539</Link>
        </Box>
    )
}

export default AddressField;