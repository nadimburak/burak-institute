"use client";

import { Box, Divider, Stack, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import React from "react";

interface FormLayoutProps {
  children: React.ReactNode;
  title: string;
}

const FormLayout: React.FC<FormLayoutProps> = ({ children, title }) => {
  const { id } = useParams();
  const isEdit = id !== "new";

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={600} color="primary">
          {isEdit ? `Edit ${title}` : `Create ${title}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEdit
            ? `You are editing an existing ${title.toLowerCase()}`
            : `Please fill the form to create a new ${title.toLowerCase()}`}
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>
      {children}
    </Stack>
  );
};

export default FormLayout;
