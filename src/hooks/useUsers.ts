import useSWR, { mutate } from 'swr';
import { User, ApiResponse, UserFormData } from '@/types/user';

// Fetcher function for SWR
const fetcher = async (url: string): Promise<any> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

export function useUsers() {
  const {
    data: response,
    error,
    isLoading,
    isValidating,
  } = useSWR<ApiResponse<User[]>>('/api/users', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  const users = response?.data || [];
  const loading = isLoading || isValidating;

  const createUser = async (userData: UserFormData): Promise<{ success: boolean; error?: string; data?: User }> => {
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
        // Optimistically update the cache
        mutate('/api/users', (current: ApiResponse<User[]> | undefined) => {
          if (current?.data) {
            return {
              ...current,
              data: [result.data!, ...current.data],
            };
          }
          return current;
        }, false);
        
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: 'An error occurred while creating user' };
    }
  };

  const updateUser = async (id: string, userData: Partial<UserFormData>): Promise<{ success: boolean; error?: string; data?: User }> => {
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
        // Optimistically update the cache
        mutate('/api/users', (current: ApiResponse<User[]> | undefined) => {
          if (current?.data) {
            return {
              ...current,
              data: current.data.map(user => 
                user._id === id ? result.data! : user
              ),
            };
          }
          return current;
        }, false);
        
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: 'An error occurred while updating user' };
    }
  };

  const deleteUser = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      const result: ApiResponse<User> = await response.json();

      if (result.success) {
        // Optimistically update the cache
        mutate('/api/users', (current: ApiResponse<User[]> | undefined) => {
          if (current?.data) {
            return {
              ...current,
              data: current.data.filter(user => user._id !== id),
            };
          }
          return current;
        }, false);
        
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: 'An error occurred while deleting user' };
    }
  };

  // Function to manually revalidate data
  const refetch = () => {
    mutate('/api/users');
  };

  return {
    users,
    loading,
    error: error?.message || response?.error || null,
    createUser,
    updateUser,
    deleteUser,
    refetch,
  };
}

// Optional: Create a hook for single user
export function useUser(id?: string) {
  const {
    data: response,
    error,
    isLoading,
    isValidating,
  } = useSWR<ApiResponse<User>>(id ? `/api/users/${id}` : null, fetcher);

  return {
    user: response?.data,
    loading: isLoading || isValidating,
    error: error?.message || response?.error || null,
  };
}