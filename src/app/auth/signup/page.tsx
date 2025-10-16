

'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputLabel,
  Link,
  FormControl,
  MenuItem,
  Select,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { useNotifications } from '@toolpad/core';

// NOTE: Hum yahan se Role Model ka import hata rahe hain.
// import Role from "@/models/user/Role.model" // <-- ISE HATA DEIN

// Ek type banate hain Role data ke liye
interface RoleType {
  _id: string;
  name: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    role: '', // <-- role ko string se initialize karein
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<RoleType[]>([]); // <-- DB se aaye roles ko yahan store karenge
  const router = useRouter();
 const notifications = useNotifications();
  // Step 1: Component load hone par API se roles fetch karein
 useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/user/signUpRole'); 
        if (!response.ok) {
          throw new Error('Failed to fetch roles');
        }
        const data: RoleType[] = await response.json();
        
        // --- DEBUGGING KE LIYE YEH LINE ADD KAREIN ---
        console.log('API SE AAYA HUA DATA:', data);
        // ---------------------------------------------

        setRoles(data);
      } catch (err) {
        setError('Could not load roles. Please try again later.');
      }
    };
    fetchRoles();
  }, []);

  // Step 2: HandleChange ko TextField aur Select dono ke liye update karein
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Step 3: Yahan se database logic (Role.find) ko poori tarah hata dein
    // Yeh sab server (API route) ka kaam hai

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    // ...baaki ka validation aacha hai...

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Role ka ID yahan bhejenge
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role, // <-- yeh role ki ID hogi
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // ... baaki ka logic aacha hai (signIn, router.push, etc.)
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
       });
 
       if (result?.error) {
         setError(result.error);
       } else {
          notifications.show("Verification Email is send, Please verify a email", { severity: 'success', autoHideDuration: 3000 });
         router.push('/');
         router.refresh();
       }

    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An error occurred during registration');
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Sign Up
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
               InputLabelProps={{ shrink: true ,sx:{
          color:"primary.main"
                                  }}}
            />

            {/* Step 4: Role ke liye extra TextField hatakar sirf Select rakhein */}
           <FormControl fullWidth margin="normal" required>
  <InputLabel 
    id="role-select-label"
    shrink={true} // <-- shrink prop yahan lagega
    sx={{ color: "primary.main" }} // <-- sx prop bhi yahan lagega
  >
    Role
  </InputLabel>
  <Select
    labelId="role-select-label"
    id="role-select"
    name="role"
    value={formData.role}
    label="Role" // <-- Yeh 'label' prop InputLabel ke saath link karne ke liye zaroori hai
    onChange={handleChange}
    disabled={isLoading || roles?.length === 0}
  >
    {/* Yahan roles ko dynamically render karein */}
    {roles?.length === 0 && <MenuItem disabled>Loading roles...</MenuItem>}
    {roles?.map((role) => (
      <MenuItem key={role._id} value={role._id}>
        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
      </MenuItem>
    ))}
  </Select>
</FormControl>

            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
               InputLabelProps={{ shrink: true ,sx:{
          color:"primary.main"
                                  }}}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
               InputLabelProps={{ shrink: true ,sx:{
          color:"primary.main"
                                  }}}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
               InputLabelProps={{ shrink: true ,sx:{
          color:"primary.main"
                                  }}}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
          </Box>
           <Box textAlign="center">
             <Link component={NextLink} href="/auth/signin" variant="body2">
               Already have an account? Sign In
             </Link>
           </Box>
        </Paper>
      </Box>
    </Container>
  );
}