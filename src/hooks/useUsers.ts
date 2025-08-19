import { useState, useEffect } from 'react';
import { User, ApiResponse, UserFormData } from '@/types/user';

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/users');
            const result: ApiResponse<User[]> = await response.json();

            if (result.success && result.data) {
                setUsers(result.data);
            } else {
                setError(result.error || 'Failed to fetch users');
            }
        } catch (err) {
            setError('An error occurred while fetching users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const createUser = async (userData: UserFormData) => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const result: ApiResponse<User> = await response.json();

            if (result.success && result.data) {
                setUsers(prev => [result.data!, ...prev]);
                return { success: true, data: result.data };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'An error occurred' };
        }
    };

    const updateUser = async (id: string, userData: Partial<UserFormData>) => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const result: ApiResponse<User> = await response.json();

            if (result.success && result.data) {
                setUsers(prev => prev.map(user =>
                    user._id === id ? result.data! : user
                ));
                return { success: true, data: result.data };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'An error occurred' };
        }
    };

    const deleteUser = async (id: string) => {
        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
            });

            const result: ApiResponse<User> = await response.json();

            if (result.success) {
                setUsers(prev => prev.filter(user => user._id !== id));
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err) {
            return { success: false, error: 'An error occurred' };
        }
    };

    return {
        users,
        loading,
        error,
        createUser,
        updateUser,
        deleteUser,
        refetch: fetchUsers,
    };
}