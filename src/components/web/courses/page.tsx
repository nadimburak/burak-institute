import React from 'react';
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
    useTheme
} from '@mui/material';
import {
    CalendarMonth as CalendarIcon,
    Schedule as ScheduleIcon,
    DataObject as DataObjectIcon,
    Psychology as PsychologyIcon,
    Storage as StorageIcon,
} from '@mui/icons-material';

// Define course data structure
interface Course {
    id: number;
    title: string;
    category: string;
    subtitle: string;
    startDate: string;
    duration: string;
    technologies: string[];
    codeSnippet: string;
    icon: React.ReactElement;
}

// Sample course data for three courses
const courses: Course[] = [
    {
        id: 1,
        title: "Full Stack Data Science 1.0",
        category: "DATA SCIENCE",
        subtitle: "From Python basics to project deployment",
        startDate: "April 12, 2025",
        duration: "6 months",
        technologies: ["Python", "TensorFlow", "Pandas", "S3"],
        codeSnippet: "import pandas as pd\nimport numpy as np\nfrom sklearn.model_selection import train_test_split\n\ndf = pd.read_csv('data.csv')",
        icon: <DataObjectIcon />
    },
    {
        id: 2,
        title: "GenAI with Python | Concept to Production",
        category: "ARTIFICIAL INTELLIGENCE",
        subtitle: "Development side of AI application",
        startDate: "April 7, 2025",
        duration: "12 months",
        technologies: ["Python", "LLMs", "Transformers", "S3"],
        codeSnippet: "from transformers import AutoModelForCausality, AutoTokenizer\n\ntokenizer = AutoTokenizer.from_pretrained('gpt2')\nmodel = AutoModelForCausality.from_pretrained('gpt2')\ninputs = tokenizer('All is transforming', return_tensors='pt')",
        icon: <PsychologyIcon />
    },
    {
        id: 3,
        title: "DevOps for Developers 1.0",
        category: "DEVELOPERS",
        subtitle: "Perfect guide to get started with DevOps",
        startDate: "April 15, 2025",
        duration: "12 months",
        technologies: ["Docker", "Kubernetes", "CI/CD", "Cloud"],
        codeSnippet: "version: '3'\nservices:\n  web:\n    image: nginx:alpine\n    ports:\n      - '80:80'",
        icon: <StorageIcon />
    }
];

// Course card component
function CourseCard({ course }: { course: Course }) {
    const theme = useTheme();

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                },
                borderRadius: 2,
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
                    color: 'white',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Typography variant="h6" fontWeight="bold">
                    {course.title}
                </Typography>
                <Box
                    sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: alpha('#fff', 0.2),
                        color: 'white',
                        display: 'flex',
                    }}
                >
                    {course.icon}
                </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Chip
                    label={course.category}
                    size="small"
                    color="primary"
                    variant="filled"
                    sx={{ mb: 2, fontWeight: 'bold' }}
                />

                <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
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

                <Box mb={2}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                        Technologies:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {course.technologies.map((tech, index) => (
                            <Chip
                                key={index}
                                label={tech}
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{ fontSize: '0.7rem' }}
                            />
                        ))}
                    </Box>
                </Box>

                <Box
                    sx={{
                        bgcolor: alpha('#000', 0.05),
                        p: 1.5,
                        borderRadius: 1,
                        fontFamily: 'Monospace',
                        fontSize: '0.8rem',
                        overflow: 'auto',
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
                        background: 'linear-gradient(135deg, #ff5252 0%, #ff1744 100%)',
                        fontWeight: 'bold',
                        py: 1,
                        '&:hover': {
                            background: 'linear-gradient(135deg, #ff1744 0%, #d50000 100%)',
                            transform: 'translateY(-1px)',
                        },
                    }}
                >
                    Enroll Now
                </Button>
            </CardContent>
        </Card>
    );
}

export default function CourseCatalog() {
    return (
        <Box sx={{
            flexGrow: 1,
            py: 6,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh'
        }}>
            <Container maxWidth="lg">
                <Box textAlign="center" mb={5}>
                    <Typography
                        variant="h2"
                        component="h1"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                            background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
                            backgroundClip: 'text',
                            textFillColor: 'transparent',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Our Courses
                    </Typography>

                    <Typography
                        variant="h5"
                        color="text.secondary"
                        paragraph
                        sx={{ maxWidth: 600, mx: 'auto' }}
                    >
                        Master programming with our expert-led cohorts. Choose your path and start your coding journey today.
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