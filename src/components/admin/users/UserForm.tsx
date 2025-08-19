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
  Snackbar,
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
    setError,
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
    try {
      const result = await onSubmit(data);
      
      if (result.success) {
        reset();
        return result;
      } else if (result.error) {
        // Handle specific errors
        if (result.error.includes('email') || result.error.includes('Email')) {
          setError('email', { message: result.error });
        } else {
          throw new Error(result.error);
        }
      }
      
      return result;
    } catch (error: any) {
      setError('root', { 
        message: error.message || 'An unexpected error occurred' 
      });
      return { success: false, error: error.message };
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {isEditing ? 'Edit User' : 'Add New User'}
      </Typography>

      {errors.root && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.root.message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Name"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          margin="normal"
          variant="outlined"
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}