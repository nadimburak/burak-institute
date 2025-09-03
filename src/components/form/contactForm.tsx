'use client'

import { Box, TextField, Button, colors } from "@mui/material";
import { useState } from "react";


export type FormData={
        name:string,
        email:string,
        phone:number,
        subject:string,
        message:string,
    }

const ContactForm = () => {


    const styles = {
        width: 500,
        "& .MuiOutlinedInput-root": {
            transition: "box-shadow 0.3s ease",
            "&:hover fieldset": {
                // border: '2px solid #7C3AED',
                border: 'none',
                boxShadow: '2px 2px 20px 2px #7C3AED',
                transition: "box-shadow 0.3s ease",
            },
            "&.Mui-focused": {
                boxShadow: '2px 2px 10px 2px #7C3AED',
            },
        }
    }

    let [formdata, setFormdata] = useState<FormData>({
        name: "",
        email: "",
        phone: 0,
        subject: "",
        message: "",
    })
    let [errors,setErrors] = useState<Partial<FormData>>({})

    const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value,
        })
    }


    const handleSubmit = (e:any) => {

        e.preventDefault();
        let newError : Partial<FormData> = {}

        if(!formdata.name) newError.name = "Name is required!!!"
        if(!formdata.email) newError.email ="email is required!!!"
        if(!formdata.message) newError.message = "Message is required!!!"
        if(!formdata.phone) newError.phone = NaN
        if(!formdata.subject) newError.subject = "subject is required!!!"

        setErrors(newError);

         if (Object.keys(newError).length > 0) return;

        console.log("From Data:", formdata);

        fetch("/api/contact", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formdata),
        })
            .then((res) => res.json())
            .then((data) => console.log("Server Response:", data));

         alert("Form Submit sucessfully!!")

    }

    return (

        <Box height={5 * 100} width={50 * 12}
            sx={{
                // border:'2px solid red',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                mt: 10,
                ml: 5,

            }}>
            <TextField id="outlined-basic" required label="Name" type="text" variant="outlined" size="medium" fullWidth={false} name="name"
                value={formdata.name} onChange={handelChange} sx={styles} placeholder="Your Name" error={Boolean(errors.name)}
  helperText={errors.name} />

            <TextField id="outlined-basic" label="Email" type="email" variant="outlined" size="medium" fullWidth={false}
                sx={styles} name="email" value={formdata.email} onChange={handelChange} placeholder="xyz@example.com" error={Boolean(errors.email)}
  helperText={errors.email}/>

            <TextField id="outlined-basic" label="Phone" variant="outlined" type="number" size="medium" fullWidth={false}
                sx={styles} name="phone" value={formdata.phone} onChange={handelChange} placeholder="xxxxxxxxxx" error={Boolean(errors.phone)}
  helperText={errors.phone}/>

            <TextField id="outlined-basic" label="subject" variant="outlined" size="medium" fullWidth={false}
                sx={styles} name="subject" value={formdata.subject} onChange={handelChange} type="text" placeholder="Subject" error={Boolean(errors.subject)} helperText={errors.subject} />

            <TextField id="outlined-basic" label="Message" variant="outlined" multiline={true} size="medium" fullWidth={false} rows={5} maxRows={20}
                sx={styles} name="message" value={formdata.message} onChange={handelChange} type="text" placeholder="Message" error={Boolean(errors.message)}
  helperText={errors.message}/>

            <Button variant="outlined" onClick={handleSubmit} sx={{ padding: "10px", paddingLeft: '50px', paddingRight: '50px', color: 'white', fontWeight: '400', fontSize: '1.2rem', border: '1px solid  #7C3AED', }}>submit</Button>
        </Box>
    )
}

export default ContactForm
