'use client';
import { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Box,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import UserForm from '@/components/admin/users/UserForm';
import UserList from '@/components/admin/users/UserList';
import { useUsers } from '@/hooks/useUsers';
import { User, UserFormData } from '@/types/user';

export default function Home() {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateUser = async (userData: UserFormData) => {
    setFormError(null);
    const result = await createUser(userData);
    if (result.success) {
      setOpenDialog(false);
      return result;
    } else {
      setFormError(result.error || 'Failed to create user');
      return result;
    }
  };

  const handleUpdateUser = async (userData: UserFormData) => {
    setFormError(null);
    if (!editingUser) return { success: false, error: 'No user selected' };
    
    const result = await updateUser(editingUser._id!, userData);
    if (result.success) {
      setEditingUser(null);
      setOpenDialog(false);
    } else {
      setFormError(result.error || 'Failed to update user');
    }
    return result;
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormError(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          User Management
        </Typography>
        <Typography variant="h6" color="textSecondary">
          CRUD Operations with Next.js, Material-UI, and MongoDB
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            fullWidth
            sx={{ py: 2 }}
          >
            Add New User
          </Button>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <UserList
            users={users}
            onEdit={handleEdit}
            onDelete={handleDeleteUser}
            loading={loading}
            error={error}
          />
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <UserForm
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            onCancel={handleCloseDialog}
            initialData={editingUser || undefined}
            isEditing={!!editingUser}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}