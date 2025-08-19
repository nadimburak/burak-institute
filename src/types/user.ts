export interface User {
  _id?: string;
  name: string;
  email: string;
  age: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  age: number;
}

// Additional types for SWR
export interface SWRResponse<T> {
  data?: T;
  error?: Error;
  isLoading: boolean;
  isValidating: boolean;
  mutate: (data?: T | Promise<T>, shouldRevalidate?: boolean) => Promise<T | undefined>;
}