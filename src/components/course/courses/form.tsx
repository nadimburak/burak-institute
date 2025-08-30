'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Icon,
    IconButton,
    Stack,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import axiosInstance from '@/utils/axiosInstance';
import { useNotifications } from '@toolpad/core';
import { handleErrorMessage } from '@/utils/errorHandler';
import { fetchUrl, defaultValues } from "@/components/course/courseTypes/constant";


import { ICourseType } from '@/models/course/CourseType.model';

// Yup validation schema
const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
});

interface ICourseTypeForm {
    name: string;
    description?: string;
    status: boolean;
}

interface FormProps {
    id?: string | 'new';
    open: boolean;
    onClose: (success?: boolean) => void;
}

export default function CourseTypeForm({ id = 'new', open, onClose }: FormProps) {
    const router = useRouter();
    const notifications = useNotifications();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ICourseType>({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });

    // Fetch existing data for edit
    const bindData = useCallback(async (id: string) => {
        try {
            const res = await axiosInstance.get(`${fetchUrl}/${id}`);
            const data = res.data.data;
            reset({
                name: data.name,
                description: data.description || '',
                status: data.status === 'active',
            });
        } catch (error: any) {
            const errorMessage = handleErrorMessage(error);
            notifications.show(errorMessage, { severity: 'error', autoHideDuration: 3000 });
        }
    }, [notifications, reset]);

    useEffect(() => {
        if (id && id !== 'new') {
            bindData(id);
        } else {
            reset(defaultValues);
        }
    }, [id, bindData, reset]);

    const onSubmit = async (data: ICourseType) => {
        try {
            const payload = { ...data, status: data.status ? 'active' : 'inactive' };
            let res;
            if (id !== 'new') {
                res = await axiosInstance.put(`${fetchUrl}/${id}`, payload);
            } else {
                res = await axiosInstance.post(fetchUrl, payload);
            }
            notifications.show(res.data.message, { severity: 'success', autoHideDuration: 3000 });
            onClose(true);
        } catch (error: any) {
            const errorMessage = handleErrorMessage(error);
            notifications.show(errorMessage, { severity: 'error', autoHideDuration: 3000 });
        }
    };

    return (
        <Dialog fullWidth open={open} onClose={() => onClose()}>
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">
                        {id !== 'new' ? 'Update Course Type' : 'Create Course Type'}
                    </Typography>
                    <IconButton onClick={() => onClose()}>
                        <Icon>close</Icon>
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        {...register('name')}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        {...register('description')}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                {...register('status')}
                                checked={watch('status')}
                                onChange={(e) => setValue('status', e.target.checked)}
                                color="primary"
                            />
                        }
                        label={watch('status') ? 'Active' : 'Inactive'}
                    />

                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button variant="contained" color="secondary" onClick={() => reset(defaultValues)}>
                            Reset
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            {id !== 'new' ? 'Update' : 'Create'}
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
}
