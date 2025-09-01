"use client";

// import MiniLogo from "@/assets/images/mini-logo";
// import AddressCard from "@/components/common/address-card";
// import theme from "@/theme/account/theme";
import { Box, Container, Grid, Link, Typography } from "@mui/material";
import React from "react";
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const WebsiteFooter: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        // backgroundColor: theme.palette.primary.main,
        color: "#7C3AED",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Column 1: Logo & Company Info */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box display="flex" alignItems="center" mb={2}>
              {/* <MiniLogo light /> */}
            </Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Burak E-Market
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Burak E-Market is a company that started in 2022 with the aim of
              providing comprehensive IT services to businesses and individuals.
            </Typography>
          </Grid>

          {/* Column 2: Company Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Company
            </Typography>
            <Box>
              {["About", "Services", "Our Works", "Contact"].map((text) => (
                <Link
                  key={text}
                  href="#"
                  color="inherit"
                  underline="hover"
                  display="block"
                  sx={{
                    mb: 0.5,
                    opacity: 0.9,
                    transition: "0.3s",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  {text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Column 3: Support Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Support
            </Typography>
            <Box>
              {["Terms & Conditions", "Privacy Policy", "Support", "FAQ"].map(
                (text) => (
                  <Link
                    key={text}
                    href="#"
                    color="inherit"
                    underline="hover"
                    display="block"
                    sx={{
                      mb: 0.5,
                      opacity: 0.9,
                      transition: "0.3s",
                      "&:hover": { opacity: 1 },
                    }}
                  >
                    {text}
                  </Link>
                )
              )}
            </Box>
          </Grid>

          {/* Column 4: Address Card */}
          <Grid size={{xs:12 ,sm:6 ,md:4}} >
  <Typography variant="h6" fontWeight="bold" gutterBottom>
    Get in touch
  </Typography>

  <Box display="flex" gap={2}>
    {[
      { icon: <InstagramIcon />, color: "#a10e8eff", href: "https://instagram.com" },
      { icon: <XIcon />, color: "#050000ff", href: "https://x.com" },
      { icon: <LinkedInIcon />, color: "#0A66C2", href: "https://linkedin.com" },
    ].map((item, index) => (
      <Link
        key={index}
        href={item.href}
        target="_blank"
        rel="noopener"
        color="inherit"
        sx={{
          display: "flex",  
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem", // icons thode bade dikhne ke liye
          opacity: 0.9,
          transition: "all 0.3s ease",
          "&:hover": {
            opacity: 1,
            color: item.color,
            transform: "scale(1.2)", // thoda zoom effect
          },
        }}
      >
        {item.icon}
      </Link>
    ))}
  </Box>
</Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WebsiteFooter;
