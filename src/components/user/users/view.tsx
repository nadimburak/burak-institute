"use client";

import { UserModel } from "@/models/User.model";
import BadgeIcon from "@mui/icons-material/Badge";
import CakeIcon from "@mui/icons-material/Cake";
import ContactsIcon from "@mui/icons-material/Contacts";
import EmailIcon from "@mui/icons-material/Email";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import GavelIcon from "@mui/icons-material/Gavel";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";
import TranslateIcon from "@mui/icons-material/Translate";
import WcIcon from "@mui/icons-material/Wc";
import WorkIcon from "@mui/icons-material/Work";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Icon,
  IconButton,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { DialogProps } from "@toolpad/core";
import React, { useEffect, useState } from "react";
import { fetchUserUrl } from "./constant";
import axiosInstance from "@/utils/axiosInstance";

interface UserViewProps extends DialogProps<undefined, string | null> {
  id: any;
}

export default function UserView({ id, open, onClose }: UserViewProps) {
  const [data, setData] = useState<UserModel>();

  useEffect(() => {
    if (id) {
      if (id != "new") {
        bindData(id);
      }
    }
  }, [id]);

  const bindData = async (id: any) => {
    const response = await axiosInstance.get(`${fetchUserUrl}/${id}`);
    setData(response.data as UserModel);
  };
  const listItemStyles = {
    "& .MuiListItemText-primary": { fontSize: "14px", fontWeight: 500 },
    "& .MuiListItemText-secondary": {
      color: "primary.main",
      fontWeight: 400,
      wordBreak: "break-word",
      fontSize: "13.5px",
    },
  };

  const usersData = data;

  const details = [
    { label: "Name", value: usersData?.name },
    { label: "Email", value: usersData?.email },
    { label: "Mobile", value: usersData?.mobile },
    { label: "Gender", value: usersData?.gender?.name },
    { label: "DOB", value: usersData?.dob?.split("T")[0] },
    { label: "Country", value: usersData?.country?.name },
    { label: "State", value: usersData?.state?.name },
    { label: "City", value: usersData?.city?.name },
    { label: "Zip Code", value: usersData?.zip_code },
    { label: "Address", value: usersData?.address },
    { label: "Father Name", value: usersData?.father_name },
    { label: "Mother Name", value: usersData?.mother_name },
    { label: "Spouse Name", value: usersData?.spouse_name },
    { label: "Marital Status", value: usersData?.marital_status?.name },
    { label: "Ethnicity", value: usersData?.ethnicity },
    { label: "Sexuality", value: usersData?.sexuality },
    { label: "Passport Number", value: usersData?.passport_number },
    {
      label: "Emergency Contact",
      value: usersData?.emergency_contact_number,
    },
    {
      label: "Languages",
      value: usersData?.language?.map((l: any) => l.name).join(", "),
    },
    { label: "Designation", value: usersData?.designation?.name },
    {
      label: "Employment Status",
      value: usersData?.employment_status?.name,
    },
    { label: "Legal Guardian", value: usersData?.legal_guardians_details },
    { label: "Role", value: usersData?.role?.name },
    { label: "Dependents", value: usersData?.dependents },
    { label: "Driver", value: usersData?.driver },
  ];

  const labelIconMap: Record<string, React.ReactNode> = {
    Name: <PersonIcon fontSize="small" />,
    Email: <EmailIcon fontSize="small" />,
    Mobile: <PhoneIcon fontSize="small" />,
    Gender: <WcIcon fontSize="small" />,
    DOB: <CakeIcon fontSize="small" />,
    Address: <HomeIcon fontSize="small" />,
    "Zip Code": <LocationOnIcon fontSize="small" />,
    Country: <PublicIcon fontSize="small" />,
    State: <PublicIcon fontSize="small" />,
    City: <PublicIcon fontSize="small" />,
    "Father Name": <PeopleIcon fontSize="small" />,
    "Mother Name": <PeopleIcon fontSize="small" />,
    "Spouse Name": <PeopleIcon fontSize="small" />,
    "Marital Status": <PeopleIcon fontSize="small" />,
    Designation: <BadgeIcon fontSize="small" />,
    Ethnicity: <BadgeIcon fontSize="small" />,
    Sexuality: <BadgeIcon fontSize="small" />,
    "Passport Number": <FingerprintIcon fontSize="small" />,
    "Emergency Contact": <ContactsIcon fontSize="small" />,
    Languages: <TranslateIcon fontSize="small" />,
    "Employment Status": <WorkIcon fontSize="small" />,
    "Legal Guardian": <GavelIcon fontSize="small" />,
    Role: <WorkIcon fontSize="small" />,
    Dependents: <PeopleIcon fontSize="small" />,
    Driver: <BadgeIcon fontSize="small" />,
  };

  const renderSection = (title: string, fields: string[]) => (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Grid container spacing={2}>
          {fields.map((label) => {
            const item = details.find((d) => d.label === label);
            return (
              <Grid
                key={label}
                size={{
                  xs: 12,
                  sm: title === "Personal Information" ? 4 : 6,
                  md:
                    title === "Personal Information"
                      ? 3
                        : title === "Other Details"
                          ? 6
                          : 6,
                }}
              >
                <ListItem disableGutters>
                  <Stack direction="row" alignItems="center">
                    {labelIconMap[item?.label || ""] && (
                      <Box mr={1} mt={0.5}>
                        {labelIconMap[item?.label || ""]}
                      </Box>
                    )}
                    <ListItemText
                      primary={item?.label}
                      secondary={item?.value || "N/A"}
                      sx={listItemStyles}
                    />
                  </Stack>
                </ListItem>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
  return (
    <Dialog open={open} onClose={() => onClose(null)} maxWidth="lg">
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{ width: 48, height: 48, bgcolor: "primary.main" }}
              src={
                usersData?.image
                  ? `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${usersData.image}`
                  : "/avatar.jpg"
              }
            >
              {usersData?.name?.charAt(0)?.toUpperCase() || "C"}
            </Avatar>
            <Stack>
              <Typography variant="h5">
                {usersData?.name || "Company User"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {data?.user?.hid || "N/A"}
              </Typography>
            </Stack>
          </Stack>
          <IconButton onClick={() => onClose(null)}>
            <Icon>close</Icon>
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} mb={4}>
          {/* Personal Info (always full width) */}
          {renderSection("Personal Information", [
            "Name",
            "Gender",
            "DOB",
            "Marital Status",
            "Father Name",
            "Mother Name",
            "Spouse Name",
            "Ethnicity",
            "Sexuality",
            "Designation",
            "Languages",
          ])}

          {/* Contact + Other Info side by side on large screens */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              {renderSection("Contact Information", [
                "Email",
                "Mobile",
                "Emergency Contact",
                "Country",
                "State",
                "City",
                "Zip Code",
                "Address",
              ])}
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              {renderSection("Company & Role", [
                "Company",
                "Role",
                "Company Branch",
                "Designation",
                "Employment Status",
              ])}
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              {renderSection("Other Details", [
                "Passport Number",
                "Company Branch",
                "Employment Status",
              ])}
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              {renderSection("Additional Info", [
                "Dependents",
                "Driver",
                "Legal Guardian",
              ])}
            </Grid>
          </Grid>
        </Stack>
        <Divider sx={{ my: 3 }} />

        <Box textAlign="right">
          <Typography variant="caption" color="text.secondary">
            Last updated:{" "}
            {data?.user?.updated_at
              ? new Date(data?.user?.updated_at).toLocaleString()
              : "—"}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
