import { Box, Typography } from "@mui/material";

interface ErrorComponentProps {
  title?: string;
  description?: string;
}

export const ErrorComponent = ({ title, description }: ErrorComponentProps) => {
  return (
    <Box>
      <Typography variant="h6" color="error">
        {title || "An error occurred"}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {description || "Please try again later."}
      </Typography>
    </Box>
  );
};
