import React from "react";
import CodeIcon from "@mui/icons-material/Code";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
  Button,
  alpha,
  useTheme,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  Schedule as ScheduleIcon,
  DataObject as DataObjectIcon,
  Psychology as PsychologyIcon,
  Storage as StorageIcon,
} from "@mui/icons-material";

// Define course data structure
interface Course {
  database?: any;
  framework?: any;
  id: number;
  title: string;
  category: string[];
  subtitle: string;
  startDate: string;
  duration: string;
  codeSnippet: string;
  icon: React.ReactElement;
  tools?: string[];
  deployment?: string[];
}

// Sample course data for three courses
const courses: Course[] = [
  {
    id: 1,
    title: "Frontend Development",
    category: ["HTML", "CSS", "JAVASCRIPT"],
    subtitle: "Master HTML, CSS, JavaScript & Beyond",
    startDate: "April 12, 2025",
    duration: "6 months",
    framework: ["REACT JS", "ANGULAR", "VUE JS"],
    codeSnippet:
      "import pandas as pd\nimport numpy as np\nfrom sklearn.model_selection import train_test_split\n\ndf = pd.read_csv('data.csv')",
    icon: <CodeIcon />,
  },
  {
    id: 2,
    title: "Backend Development",
    category: ["JAVA", "PHP", "NODE JS"],
    subtitle: "Transforming Ideas into Reliable Software",
    startDate: "April 7, 2025",
    duration: "12 months",
    database: ["My SQL", "MONGO DB"],
    codeSnippet:
      "from transformers import AutoModelForCausality, AutoTokenizer\n\ntokenizer = AutoTokenizer.from_pretrained('gpt2')\nmodel = AutoModelForCausality.from_pretrained('gpt2')\ninputs = tokenizer('All is transforming', return_tensors='pt')",
    icon: <PsychologyIcon />,
    framework: undefined,
  },
  {
    id: 3,
    title: "Full-Stack Development",
    category: ["FRONTEND", "BACKEND", "DATABASE", "TOOLS", "DEPLOYMENT"],
    subtitle: "Designing APIs, Databases & Server-Side Logic That Work",
    startDate: "April 15, 2025",
    duration: "12 months",
    codeSnippet:
      "version: '3'\nservices:\n  web:\n    image: nginx:alpine\n    ports:\n      - '80:80'",
    icon: <StorageIcon />,
    framework: ["React.js", "Node.js (Express)", "Django"],
    database: ["MySQL", "MongoDB"],
    tools: ["Git", "Docker"],
    deployment: ["AWS", "Vercel"],
  },
];

// Course card component
function CourseCard({ course }: { course: Course }) {
  const theme = useTheme();
    
   const sections = [
  { key: "framework", label: "Frameworks/Libraries" },
  { key: "database", label: "Database" },
];

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
          color: "white",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {course.title}
        </Typography>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: alpha("#fff", 0.2),
            color: "white",
            display: "flex",
          }}
        >
          {course.icon}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box mb={2}>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Category:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={0.5}>
            {Array.isArray(course?.category) &&
              course.category.map((ra, index) => (
                <Chip
                  key={index}
                  label={ra}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ fontSize: "0.7rem" }}
                />
              ))}
          </Box>
        </Box>

        {/* {Array.isArray(course?.framework) && course.framework.length > 0 && (
          <Box mb={2}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              Frameworks/Libraries:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {course.framework.map((frame, index) => (
                <Chip
                  key={index}
                  label={frame}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ fontSize: "0.7rem" }}
                />
              ))}
            </Box>
          </Box>
        )} */}

        {/* {Array.isArray(course?.database) && course.database.length > 0 && (
          <Box mb={2}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              Database:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {course.database.map((data, index) => (
                <Chip
                  key={index}
                  label={data}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ fontSize: "0.7rem" }}
                />
              ))}
            </Box>
          </Box>
        )} */}

     {sections.map(
  (section) => {
    const items = (course as any)?.[section.key] as string[]; // 👈 cast to string[]
    return (
      Array.isArray(items) &&
      items.length > 0 && (
        <Box mb={2} key={section.key}>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            {section.label}:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={0.5}>
            {items.map((item, index) => (
              <Chip
                key={index}
                label={item}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ fontSize: "0.7rem" }}
              />
            ))}
          </Box>
        </Box>
      )
    );
  }
)}


        <Typography
          variant="body1"
          color="text.secondary"
          gutterBottom
          sx={{ mb: 2 }}
        >
          {course.subtitle}
        </Typography>

        <Box display="flex" alignItems="center" my={2}>
          <CalendarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Starts {course.startDate}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={2}>
          <ScheduleIcon fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {course.duration}
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: alpha("#000", 0.05),
            p: 1.5,
            borderRadius: 1,
            fontFamily: "Monospace",
            fontSize: "0.8rem",
            overflow: "auto",
            maxHeight: 120,
            mb: 2,
          }}
        >
          {course.codeSnippet}
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{
            background: "linear-gradient(135deg, #5255ffff 0%, #5255ffff 0%",
            fontWeight: "bold",
            py: 1,
            "&:hover": {
              background: "linear-gradient(135deg, #2e17ffff 0%, #2e17ffff 0%",
              transform: "translateY(-1px)",
            },
          }}
        >
          Apply Now
        </Button>
      </CardContent>
    </Card>
  );
}

export default function CourseCatalog() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        py: 6,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={5}>
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Our Courses
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            paragraph
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Master programming with our expert-led cohorts. Choose your path and
            start your coding journey today.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid size={{ xs: 12, md: 4 }} key={course.id}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>

        <Box textAlign="center" mt={6}>
          <Typography variant="h6" color="text.secondary">
            More courses coming soon...
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
