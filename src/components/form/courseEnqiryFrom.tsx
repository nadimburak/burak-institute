"use client"


import { useState, useEffect } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import * as y from 'yup';
import { useNotifications } from "@toolpad/core";
import { Box, TextField, Button } from "@mui/material"
import SubjectAutocomplete from "@/components/autocomplete/SubjectAutocomplete";
import { yupResolver } from "@hookform/resolvers/yup";
import CourseAutocomplete from "@/components/autocomplete/CourseAutoComplete"

const CouserEnquiryForm = () => {


    const notifications: any = useNotifications()
    const FormSchema = y.object({
        username: y.string().required("username is required!!!"),
        email: y.string().email("Please enter a valid email address").required("email is required!!!"),
        subject: y.object({
            _id: y.string().required("subject id is required!!!"),
            name: y.string().required("subject name is required!!!")
        }).nullable()
            .required("Subject is required!!!"),
        courses: y.object({
            _id: y.string().required("Course id is required!!!"),
            name: y.string().required("course name is required!!!")
        }).nullable()
            .required("Course is required!!!"),

        description: y.string().required("description is required!!!")
    })

    interface IcourseEnquiry {
        username: string,
        email: string,
        subject: { _id: string, name: string } | null,
        courses: { _id: string, name: string } | null,
        description: string,
    }

    const { control, handleSubmit, reset ,setValue, formState: { errors } } = useForm<IcourseEnquiry>({
        resolver: yupResolver(FormSchema),
        defaultValues: {
            username: '',
            email: "",
            subject: null,
            courses: null,
            description: ""
        }
    })

    const onSubmit: SubmitHandler<IcourseEnquiry> = async (data) => {
        console.log('Form Data:', data);
        const payload = {
            ...data,
            subject: data.subject?._id,
            courses: data.courses?._id, // note: field name in schema is 'courses'
        };

        try {
            const response = await fetch('/api/course/course-enquiry', {
                method: 'POST',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify(payload),
            })

            if (!response) {
                notifications.show("Network response was not ok", {
                    severity: "failed",
                    autoHideDuration: 3000,
                });
                const errorResult = await response.json();
                const message = errorResult.message || "Form submission failed!";
                notifications.show(message, { severity: "error" }); // "failed" ki jagah "error" standard hai
                throw new Error(message);
            }
            const result = await response.json();
            notifications.show("Course-Enquiry Submited successFully ", {
                severity: "success",
                autoHideDuration: 3000
            })
            console.log('Success:', result);

            reset(); 

        } catch (error) {

            notifications.show("Form Submition failed!!!", {
                severity: "failed",
                autoHideDuration: 3000,
            });
            console.error('Error submitting form:', error);
        }

    }


    return (
        <Box height={"60vh"} width={"80vw"} display="flex" justifyContent={"center"} alignItems={"center"} >

            <form onSubmit={handleSubmit(onSubmit)}>
                <Box height={"50vh"} width={"30vw"} flexDirection="column" display="flex" justifyContent={"center"} alignItems={"center"} gap={3}>
                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="UserName"
                                variant='outlined'
                                error={!!errors.username || undefined}
                                helperText={errors.username?.message}
                                fullWidth
                            />
                        )}
                    />

                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Email"
                                variant='outlined'
                                error={!!errors.email || undefined}
                                helperText={errors.email?.message}
                                fullWidth
                            />
                        )}
                    />

                    <Controller
                        name="subject"
                        control={control}
                        render={({ field }) => (
                            <SubjectAutocomplete
                                {...field}
                                fullWidth
                                setValue={setValue}
                                error={!!errors.subject || undefined}
                                helperText={errors.subject ? "Subject is required" : ""}

                            />
                        )}
                    />

                    <Controller
                        name="courses"
                        control={control}
                        render={({ field }) => (
                            <CourseAutocomplete
                                {...field}
                                setValue={setValue}
                                fullWidth
                                error={!!errors.courses || undefined}
                                helperText={errors.courses ? "Course is required" : ""}

                            />
                        )}
                    />

                    <Controller
                        name="description"
                        control={control}
                        
                        render={({ field }) => (
                            <TextField
                                {...field}
                              
                                label="Description"
                                variant='outlined'
                                error={!!errors.description || undefined}
                                helperText={errors.description?.message}
                                fullWidth
                            />
                        )}
                    />

                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, py: 1.5 }}>
                        Submit
                    </Button>
                </Box>
            </form>
        </Box>
    )
}

export default CouserEnquiryForm