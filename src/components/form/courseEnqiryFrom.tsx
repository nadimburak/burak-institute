"use client"



import { useForm, SubmitHandler } from 'react-hook-form';
import * as y from 'yup';
import { useNotifications } from "@toolpad/core";
import { Box, TextField, Button } from "@mui/material"
import SubjectAutocomplete from "@/components/autocomplete/SubjectAutocomplete";
import { yupResolver } from "@hookform/resolvers/yup";
import CourseAutoComplete from '../autocomplete/course/CourseAutoComplete';
import { ICourseEnquiry } from '@/models/course/CourseEnquiryModel';

const CourseEnquiryForm = () => {
    const notifications = useNotifications()

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



    const { handleSubmit, register, watch, reset, setValue, formState: { errors } } = useForm<ICourseEnquiry>({
        resolver: yupResolver(FormSchema),
        defaultValues: {
            username: '',
            email: "",
            subject: { _id: '', name: '' },
            courses: { _id: '', name: '' },
            description: ""
        }
    })
    const subject = watch("subject");
    const courses = watch("courses");

    const onSubmit: SubmitHandler<ICourseEnquiry> = async (data) => {
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
                notifications.show(message, { severity: "error" });
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

                    <TextField
                        label="Username"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                            sx: {
                                color: "primary.main",
                            },
                        }}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                        {...register("username")}
                    />

                    <TextField
                        label="email"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                            sx: {
                                color: "primary.main",
                            },
                        }}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        {...register("email")}
                    />


                    <SubjectAutocomplete
                        setValue={setValue}
                        fullWidth
                        value={subject}
                        error={!!errors.subject}
                        helperText={errors.subject ? "Subject is required" : ""}
                    />


                    <CourseAutoComplete
                        setValue={(value) => setValue("courses", value)}
                        fullWidth
                        value={courses}
                        error={!!errors.courses}
                        helperText={errors.courses ? "Course is required" : ""}
                    />


                    <TextField

                        label="description"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                            sx: {
                                color: "primary.main",
                            },
                        }}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        {...register("description")}
                    />


                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, py: 1.5 }}>
                        Submit
                    </Button>
                </Box>
            </form>
        </Box>
    )
}

export default CourseEnquiryForm