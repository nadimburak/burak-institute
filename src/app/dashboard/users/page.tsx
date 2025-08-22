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
  Snackbar,
  IconButton,
} from '@mui/material';
import { Add, Refresh, Close } from '@mui/icons-material';
import UserForm from '@/components/admin/users/UserForm';
import UserList from '@/components/admin/users/UserList';
import { useUsers } from '@/hooks/useUsers';
import { User, UserFormData } from '@/types/user';

export default function Home() {
  const { users, loading, error, createUser, updateUser, deleteUser, refetch } = useUsers();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateUser = async (userData: UserFormData) => {
    const result = await createUser(userData);
    if (result.success) {
      showSnackbar('User created successfully!');
      setOpenDialog(false);
    } else {
      showSnackbar(result.error || 'Failed to create user', 'error');
    }
    return result;
  };

  const handleUpdateUser = async (userData: UserFormData) => {
    if (!editingUser) return { success: false, error: 'No user selected' };

    const result = await updateUser(editingUser._id!, userData);
    if (result.success) {
      showSnackbar('User updated successfully!');
      setEditingUser(null);
      setOpenDialog(false);
    } else {
      showSnackbar(result.error || 'Failed to update user', 'error');
    }
    return result;
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const result = await deleteUser(id);
      if (result.success) {
        showSnackbar('User deleted successfully!');
      } else {
        showSnackbar(result.error || 'Failed to delete user', 'error');
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleRefresh = () => {
    refetch();
    showSnackbar('Data refreshed!');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          User Management
        </Typography>
        <Typography variant="h6" color="textSecondary">
          CRUD Operations with Next.js, Material-UI, and SWR
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
              sx={{ py: 2 }}
            >
              Add New User
            </Button>

            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              Refresh Data
            </Button>

            {loading && (
              <Alert severity="info">
                Loading users...
              </Alert>
            )}
          </Box>
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
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <UserForm
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            onCancel={handleCloseDialog}
            initialData={editingUser || undefined}
            isEditing={!!editingUser}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        message={snackbar.message}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}