"use client";

import { Box, Button, Chip, Stack, Typography, useTheme } from "@mui/material";
import CoursePage from "./courses/page";

export default function MainPage() {
  const theme = useTheme(); // 🎨 theme se colors lena
  const features = [
    "Peer learning",
    "Code reviews",
    "Virtual hostel",
    "Doubt sessions",
    "Bounties",
  ];

  return (
    <>
      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          textAlign: "center",
          py: 10,
          px: 3,
        }}
      >
        {/* Heading */}
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            color: theme.palette.text.primary,
            fontSize: { xs: "2rem", md: "3.5rem" },
            mb: 3,
          }}
        >
          Consistency and{" "}
          <Box
            component="span"
            sx={{
              position: "relative",
              display: "inline-block",
              color: theme.palette.primary.main,
              "&::after": {
                content: '""',
                position: "absolute",
                left: 0,
                bottom: 4,
                width: "100%",
                height: "6px",
                bgcolor: theme.palette.secondary.main, // light purple underline
                zIndex: -1,
              },
            }}
          >
            Community
          </Box>
        </Typography>

        {/* Subheading */}
        <Typography
          variant="h6"
          sx={{
            maxWidth: "700px",
            mx: "auto",
            color: theme.palette.text.secondary,
            mb: 4,
          }}
        >
          An unmatched Learning Experience for coding courses — bounties, peer
          learning, code reviews, virtual hostel, alumni network, doubt sessions,
          and group projects.
        </Typography>

        {/* Feature Pills */}
        <Stack
          direction="row"
          flexWrap="wrap"
          justifyContent="center"
          gap={2}
          mb={5}
        >
          {features.map((feature, index) => (
            <Chip
              key={index}
              label={feature}
              variant="outlined"
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                fontWeight: 500,
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                },
              }}
            />
          ))}
        </Stack>

        {/* CTA Button */}
        <Button
          variant="contained"
          sx={(theme) => ({
            bgcolor: theme.palette.primary.main,
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            borderRadius: "12px",
            "&:hover": {
              bgcolor: theme.palette.primary.dark,
            },
          })}
        >
          Check all Live Cohorts
        </Button>

      </Box>
      <CoursePage />
    </>
  );
}
