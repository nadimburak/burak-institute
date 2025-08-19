'use client';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    Box,
    CircularProgress,
    Alert,
    IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { User } from '@/types/user';

interface UserListProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
    loading?: boolean;
    error?: string | null;
}

export default function UserList({ users, onEdit, onDelete, loading, error }: UserListProps) {
    if (loading) {
        return (
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Users
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Users
                </Typography>
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            </Paper>
        );
    }

    if (users.length === 0) {
        return (
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Users
                </Typography>
                <Typography color="textSecondary" sx={{ py: 4, textAlign: 'center' }}>
                    No users found. Add your first user!
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Users ({users.length})
            </Typography>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.age}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => onEdit(user)}
                                            size="small"
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => onDelete(user._id!)}
                                            size="small"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}