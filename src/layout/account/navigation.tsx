"use client";

import Accounts from '@/icons/duotone/Accounts';
import Dashboard from "@/icons/duotone/Dashboard";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DnsIcon from '@mui/icons-material/Dns';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { type Navigation } from "@toolpad/core/AppProvider";
import WorkIcon from '@mui/icons-material/Work';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import ArchiveIcon from '@mui/icons-material/Archive';
import MessageIcon from "@mui/icons-material/Message";

const DotIcon = <FiberManualRecordIcon sx={{ fontSize: 8, ml: 1 }} />;

const accountNavigation: Navigation = [
  {
    kind: "header",
    title: "Main Items",
  },
  {
    segment: "account",
    title: "Dashboard",
    icon: <Dashboard />,
  },
  {
    title: "Appointment",
    icon: <EditCalendarIcon />,
    children: [
      {
        title: "Appointments",
        segment: "account/appointments",
        icon: <>{DotIcon}</>,
      },
      {
        title: "Appointment Apply",
        segment: "account/appointment-apply",
        icon: <>{DotIcon}</>,
      },
      {
        icon: <>{DotIcon}</>,
        title: "Invoice",
        segment: "account/invoice",

      },

    ],
  },
  {
    title: "Details",
    icon: <DnsIcon />,
    children: [
      {
        icon: <>{DotIcon}</>,
        title: "Bank",
        segment: "account/banks",
      },
      {
        icon: <>{DotIcon}</>,
        title: "Education",
        segment: "account/educations",

      },
      {
        icon: <>{DotIcon}</>,
        title: "Document",
        segment: "account/documents",
      },
      {
        icon: <>{DotIcon}</>,
        title: "Address",
        segment: "account/address",
      },
      {
        icon: <>{DotIcon}</>,
        title: "Report Document",
        segment: "account/report-document",
      },
    ],
  },
  {
    segment: "account/product-quotations",
    title: "Product Quotations ",
    icon: <ArchiveIcon />,
  },
  {
      segment: "",
      title: "Chats",
      icon: <MessageIcon />,
      children: [
        { segment: "account/user-chat", title: "Chats", icon: DotIcon },
      ],
    },
  {
    title: "Health & Condition",
    icon: <HealthAndSafetyIcon />,
    children: [
      {
        icon: <>{DotIcon}</>,
        title: "Allergy",
        segment: "account/allergies",
      },
      {
        icon: <>{DotIcon}</>,
        title: "Medical Condition",
        segment: "account/medical-condition",
      },
      {
        icon: <>{DotIcon}</>,
        title: "Medical Cover",
        segment: "account/medical-covers",
      },
      {
        icon: <>{DotIcon}</>,
        title: "Vaccination",
        segment: "account/vaccination",
      },
    ]
  },
  {
    title: "Vacancy",
    icon: <WorkIcon />,
    children: [
      {
        icon: <>{DotIcon}</>,
        title: "Job Vacancies",
        segment: "account/vacancy",
      },
    ]
  },
  {
    segment: "account/customer-vehicles",
    title: "Vehicles ",
    icon: <TwoWheelerIcon />,
  },
  {
    kind: "header",
    title: "Profile",
  },
  {
    segment: "account/profile",
    title: "Profile",
    icon: <Accounts />,
  },

  // {
  //   title: "ACCOUNT SETTINGS",
  //   children: [
  //     {
  //       icon: "PersonOutlined",
  //       segment: "/account/profile",
  //       title: "Profile Info",
  //     },
  //   ],
  // },
];

export default accountNavigation;
