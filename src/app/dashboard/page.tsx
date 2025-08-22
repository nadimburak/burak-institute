'use client';

import React from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Avatar,
} from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
    router.refresh();
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              mr: 2,
              bgcolor: 'primary.main'
            }}
          >
            {session?.user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4">Welcome, {session?.user?.name}!</Typography>
            <Typography variant="body1" color="textSecondary">
              {session?.user?.email}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" paragraph>
          This is your protected dashboard. Only authenticated users can see this page.
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </Paper>
    </Container>
  );
}