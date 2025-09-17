'use client'

import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";
import * as z from "zod";
import { useNotifications } from '@toolpad/core';
import SubjectAutocomplete from "@/components/autocomplete/SubjectAutocomplete";
import mongoose,{Types} from 'mongoose'

// 1. Zod Schema ko behtar banaya gaya hai
export const formDataSchema = z.object({
    name: z.string().min(1, "Name is required!!!"),
    description: z.string().min(1, "Description is required!!!"),
    course: z.string().min(2, "Course is required!!"),
    // Yeh subject ke rule ko 'null' aur empty string dono ke liye aacha banata hai
    // subject: z.string().nullable().refine(val => val && val.trim().length > 0, {
    //     message: "Subject is required!!!",
     subject: z.string().min(1, "Subject is required"),})


export type FormData = {
    name: string,
    course: string,
    subject:string,
    description: string,
}

const ContactForm = () => {
    const notifications = useNotifications();

    const styles = {
        width: 500,
        "& .MuiOutlinedInput-root": {
            transition: "box-shadow 0.3s ease",
            "&:hover fieldset": {
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
        subject: "", // <-- Shuruaati value null rakhein
        description: "",
        course: "",
    })
    let [errors, setErrors] = useState<Partial<FormData>>({})

    const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value,
        })
    }
    
    // 2. Autocomplete ke liye naya handler
    const handleSubjectChange = (newValue: any) => {
        setFormdata({
            ...formdata,
           subject: newValue ? newValue.id : "", 
        });
    };


    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = formDataSchema.safeParse(formdata);

if (!result.success) {
  const newError: Partial<FormData> = {};
  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as keyof FormData;
    newError[field] = issue.message as any;
  });
  setErrors(newError);
  return;
}

// ✅ backend ko clean validated data bhejna hai


    setErrors({});

    try {
       const res = await fetch("/api/course/course-enquiry", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(result.data),
});
    

        const data = await res.json();
        console.log("Server Response:", data);
        
        // YEH ZAROORI HAI: Server se error aane par handle karein (jaise 400, 500)
        if (!res.ok) {
            notifications.show(data.message || "Something went wrong on the server.", {
                severity: 'error',
            });
            return; // Error aane par form reset na karein
        }

        // ✅ Reset form sirf success hone par
        setFormdata({
            name: "",
            course: "",
            subject: "",
            description: "",
        });

        notifications.show(data.message || "Form submitted successfully!", {
            severity: 'success',
            autoHideDuration: 3000,
        });
        
    } catch (error) {
        console.error("Submission error:", error);
        notifications.show("An unexpected error occurred.", {
            severity: 'error',
        });
    }
};

    return (

        <Box height={5 * 100} width={50 * 12}
            sx={{
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


            <TextField id="outlined-basic" label="Course" variant="outlined" size="medium" fullWidth={false}
                sx={styles} name="course" value={formdata.course} onChange={handelChange} error={Boolean(errors.course)}
                helperText={errors.course} />

            {/* 3. TextField ko SubjectAutocomplete se replace kar diya gaya hai */}
            <SubjectAutocomplete
                value={formdata.subject}
                onChange={(newValue) => handleSubjectChange(newValue)}
                label="Subject"
                placeholder="Search for a subject..."
                // Error dikhane ke liye yeh props add karein (agar aapka component support karta hai)
                // In props ko aapko apne SubjectAutocomplete component ke andar handle karna hoga
                // error={Boolean(errors.subject)}
                // helperText={errors.subject}
                // sx={styles}
            />

            <TextField id="outlined-basic" label="Description" variant="outlined" multiline={true} size="medium" fullWidth={false} rows={5} maxRows={20}
                sx={styles} name="description" value={formdata.description} onChange={handelChange} type="text" placeholder="description" error={Boolean(errors.description)}
                helperText={errors.description} />

            <Button variant="outlined" onClick={handleSubmit} sx={{ padding: "10px", paddingLeft: '50px', paddingRight: '50px', color: 'white', fontWeight: '400', fontSize: '1.2rem', border: '1px solid  #7C3AED', }}>submit</Button>
        </Box>
    )
}

export default ContactForm