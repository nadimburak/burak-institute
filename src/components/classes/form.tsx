'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Icon,
    IconButton,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import axiosInstance from '@/utils/axiosInstance';
import { useNotifications } from '@toolpad/core';
import { handleErrorMessage } from '@/utils/errorHandler';
import {defaultValues,fetchUrl} from "./constant";


// Yup validation schema
const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
});

interface IClasses {
    name: string;
}

interface FormProps {
    id?: string | 'new';
    open: boolean;
    onClose: (success?: boolean) => void;
}

export default function ClassesForm({ id = 'new', open, onClose }: FormProps) {
    const notifications = useNotifications();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IClasses>({
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
            });
        } catch (error: unknown) {
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

    const onSubmit = async (data: IClasses) => {
        try {
            const payload = { ...data  };
            let res;
            if (id !== 'new') {
                res = await axiosInstance.put(`${fetchUrl}/${id}`, payload);
            } else {
                res = await axiosInstance.post(fetchUrl, payload);
            }
            notifications.show(res.data.message, { severity: 'success', autoHideDuration: 3000 });
            onClose(true);
        } catch (error: unknown) {
            const errorMessage = handleErrorMessage(error);
            notifications.show(errorMessage, { severity: 'error', autoHideDuration: 3000 });
        }
    };

    return (
        <Dialog fullWidth open={open} onClose={() => onClose()}>
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">
                        {id !== 'new' ? 'Update Class Type' : 'Create Class Type'}
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
