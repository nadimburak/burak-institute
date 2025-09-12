'use client'

import { Box, TextField, Button, colors } from "@mui/material";
import { useState } from "react";
import * as z from "zod";
import { useNotifications } from '@toolpad/core';


export const formDataSchema = z.object({
    name: z.string().min(1, "Name is required!!!"),
    email: z.string().email("Email is invalid").min(1, "Email is required!!!"),
    message: z.string().min(1, "Message is required!!!"),
    phone: z.string()
        .regex(/^\d+$/, "Phone must be numeric")
        .min(10, "Phone must be at least 10 digits"),
    subject: z.string().min(1, "Subject is required!!!"),
});

export type FormData = {
    name: string,
    email: string,
    phone: string,
    subject: string,
    message: string,
}

const ContactForm = () => {
const notifications = useNotifications()

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
        subject: "",
        message: "",
        phone: ""
    })
    let [errors, setErrors] = useState<Partial<FormData>>({})

    const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value,
        })
    }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const result = formDataSchema.safeParse(formdata);

  if (!result.success) {
    const newError: Partial<FormData> = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof FormData;
      newError[field] = issue.message as any; // because FormData fields are string, this is fine
    });
    setErrors(newError);
    return;
  }

  setErrors({});

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    const data = await res.json();
    console.log("Server Response:", data);

    // ✅ Reset form
    setFormdata({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

     notifications.show(data.message || "Form submitted successfully!", {
        severity: 'success',
        autoHideDuration: 3000,
      });
  } catch (error) {
    console.error("Submission error:", error);
  }
};

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
                helperText={errors.email} />

            <TextField id="outlined-basic" label="Phone" variant="outlined" size="medium" fullWidth={false}
                sx={styles} name="phone" value={formdata.phone} onChange={handelChange} placeholder="xxxxxxxxxx" error={Boolean(errors.phone)}
                helperText={errors.phone} />

            <TextField id="outlined-basic" label="subject" variant="outlined" size="medium" fullWidth={false}
                sx={styles} name="subject" value={formdata.subject} onChange={handelChange} type="text" placeholder="Subject" error={Boolean(errors.subject)} helperText={errors.subject} />

            <TextField id="outlined-basic" label="Message" variant="outlined" multiline={true} size="medium" fullWidth={false} rows={5} maxRows={20}
                sx={styles} name="message" value={formdata.message} onChange={handelChange} type="text" placeholder="Message" error={Boolean(errors.message)}
                helperText={errors.message} />

            <Button variant="outlined" onClick={handleSubmit} sx={{ padding: "10px", paddingLeft: '50px', paddingRight: '50px', color: 'white', fontWeight: '400', fontSize: '1.2rem', border: '1px solid  #7C3AED', }}>submit</Button>
        </Box>
    )
}

export default ContactForm
