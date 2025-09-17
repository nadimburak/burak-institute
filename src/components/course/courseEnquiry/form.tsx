"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Box,
  FormHelperText,
} from "@mui/material";
import { useEffect, useMemo } from "react";
import axios from "axios";
import SubjectAutocomplete from "@/components/autocomplete/SubjectAutocomplete";

type FormValues = {
  name: string;
  subject: { id: string; name: string } | null;
  courses: string;
  description?: string;
};

const schema = yup.object({
  name: yup.string().required("Name is required"),
  subject: yup
    .object()
    .shape({
      id: yup.string().required(),
      name: yup.string(),
    })
    .nullable()
    .required("Subject is required"),
  courses: yup.string().required("Courses is required"),
  description: yup.string().optional(),
});

interface CourseEnquiryFormProps {
  id?: string;
  open: boolean;
  onClose: (result?: unknown) => void;
  payload?: { [key: string]: any; subject: string };
}

export default function CourseEnquiryForm({
  id,
  open,
  onClose,
  payload,
}: CourseEnquiryFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      subject: null,
      courses: "",
      description: "",
    },
  });

  useEffect(() => {
    const initializeForm = async () => {
      if (open) {
        if (payload) {
          reset({
            name: payload.name ?? "",
            courses: payload.courses ?? "",
            description: payload.description ?? "",
            subject: null,
          });
          if (payload.subject) {
            try {
              const res = await axios.get(`/api/subject/${payload.subject}`);
              if (res.data) {
                setValue("subject", res.data, { shouldValidate: true });
              }
            } catch (err) { console.error("Failed to fetch initial subject", err); }
          }
        } else {
          reset();
        }
      }
    };
    initializeForm();
  }, [open, payload?.subject, reset, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (!data.subject) {
      console.error("Subject is null, submission stopped.");
      return;
    }
    const transformedData = { ...data, subject: data.subject.id };
    
    

    try {
      if (id && id !== "new") {
        
        await axios.put(`/api/course/course-enquiry/${id}`, transformedData);
      } else {
        await axios.post(`/api/course/course-enquiry`, transformedData);
      }
      reset();
      onClose(true);
    } catch (err) { console.error("Error saving course enquiry:", err); }
  };

  const onInvalid = (errors: any) => { console.error("Form validation failed:", errors); };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {id === "new" ? "Create Course Enquiry" : "Edit Course Enquiry"}
      </DialogTitle>
      
      <form id="courseEnquiry-form" onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{xs:12}}>
                <Controller name="name" control={control} render={({ field }) => ( <TextField {...field} label="Enquiry Name" fullWidth error={!!errors.name} helperText={errors.name?.message}/> )}/>
              </Grid>

              <Grid size={{xs:12}} >
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => {
                    const memoizedAutocomplete = useMemo(() => {
                      console.log(field);
                      
                      return (
                        // ✅✅✅ MAIN FIX: onChange ko wrapper ke saath pass karein ✅✅✅
                        <SubjectAutocomplete
                          value={field.value}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          onChange={ (newValue) => {
                            // Agar value empty string hai, toh use null bana dein
                            if (newValue === "") {
                              field.onChange(null);
                            } else {
                              field.onChange(newValue);
                            }
                          }}
                          label="Subject"
                          placeholder="Search for a subject..."
                        />
                      );
                    }, [field.value, errors.subject, field.ref, field.onBlur, field.onChange]);

                    return (
                      <>
                        {memoizedAutocomplete}
                        {errors.subject && (
                          <FormHelperText error>
                            {errors.subject.message}
                          </FormHelperText>
                        )}
                      </>
                    );
                  }}
                />
              </Grid>

              <Grid  size={{xs:12}}>
                <Controller name="courses" control={control} render={({ field }) => ( <TextField {...field} label="Courses" fullWidth error={!!errors.courses} helperText={errors.courses?.message}/> )}/>
              </Grid>

              <Grid size={{xs:12}}>
                <Controller name="description" control={control} render={({ field }) => (<TextField {...field} label="Description (Optional)" fullWidth multiline rows={3}/>)}/>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)}>Cancel</Button>
          <Button type="submit" form="courseEnquiry-form" variant="contained">
            {id === "new" ? "Create" : "Update"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}