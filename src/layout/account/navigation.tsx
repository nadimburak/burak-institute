"use client";

import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { type Navigation } from "@toolpad/core/AppProvider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SubjectIcon from '@mui/icons-material/Subject';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const DotIcon = <FiberManualRecordIcon sx={{ fontSize: 8, ml: 1 }} />;

const accountNavigation: Navigation = [
  {
    kind: "header",
    title: "Main Items",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    title: "User",
    icon: <EditCalendarIcon />,
    children: [
      {
        title: "Permissions",
        segment: "dashboard/user/permissions",
        icon: <>{DotIcon}</>,
      },
      {
        title: "Roles",
        segment: "dashboard/user/roles",
        icon: <>{DotIcon}</>,
      },
      {
        title: "Users",
        segment: "dashboard/user/users",
        icon: <>{DotIcon}</>,
      },
    ],
  },
  {
    title: "Courses",
    icon: <MenuBookIcon />,
    children: [
      {
        title: "Course Types",
        segment: "dashboard/course/course-types",
        icon: <>{DotIcon}</>,
      },
      {
        title: "Courses",
        segment: "dashboard/course/courses",
        icon: <>{DotIcon}</>,
      },
    ],
  },
  {
    segment: "dashboard/subject",
    title: "Subject",
    icon: <SubjectIcon />,
  },
    {
    segment: "dashboard/classes",
    title: "Classes",
    icon: <DashboardIcon />,
  },
    {
    segment: "dashboard/class-section",
    title: "ClassSection",
    icon: <DashboardIcon />,
  },
  
  {
    segment:"dashboard/contact",
    title:"Contact",
    
  }
];

export default accountNavigation;
