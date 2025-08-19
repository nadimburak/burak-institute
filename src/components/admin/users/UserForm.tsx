'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { userSchema } from '@/schemas/userSchema';
import { UserFormData } from '@/types/user';

interface UserFormProps {
  onSubmit: (data: UserFormData) => Promise<{ success: boolean; error?: string }>;
  onCancel?: () => void;
  initialData?: UserFormData & { _id?: string };
  isEditing?: boolean;
}

export default function UserForm({ onSubmit, onCancel, initialData, isEditing = false }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<UserFormData>({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      age: undefined as any,
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('email', initialData.email);
      setValue('age', initialData.age);
    }
  }, [initialData, setValue]);

  const handleFormSubmit = async (data: UserFormData) => {
    const result = await onSubmit(data);
    if (result.success) {
      reset();
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {isEditing ? 'Edit User' : 'Add New User'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Name"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          margin="normal"
          variant="outlined"
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          margin="normal"
          variant="outlined"
        />

        <TextField
          fullWidth
          label="Age"
          type="number"
          {...register('age')}
          error={!!errors.age}
          helperText={errors.age?.message}
          margin="normal"
          variant="outlined"
          inputProps={{ min: 0, max: 150 }}
        />

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="outlined"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}