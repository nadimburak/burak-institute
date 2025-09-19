import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  FormLabel,
} from "@mui/material";
import Link from "next/link";
import CategoryIcon from "@mui/icons-material/Category";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export interface ISubject {
  _id: string;
  name: string;
}

export interface CourseModel {
  _id: string;
  name: string;
  description?: string;
  duration?: string;
  image?: string;
  subject?: ISubject | string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface CoursesCardProps {
  data: CourseModel;
}

const CoursesCard: React.FC<CoursesCardProps> = ({ data }) => {
  return (
    <Card
      sx={{
        borderRadius: 1,
        boxShadow: 3,
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
        bgcolor: "background.paper",
      }}
    >
      {/* Course Image */}
      {data?.image && (
        <Box
          component="img"
          src={`/uploads/${data?.image}`}
          alt={data?.name}
          sx={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.03)",
            },
          }}
        />
      )}

      <CardContent sx={{ p: 2 }}>
        {/* Course Name */}
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            mb: 0.8,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            color: "text.primary",
          }}
        >
          {data?.name}
        </Typography>

        {/* Course Type */}
        {/* <Box display="flex" alignItems="center" gap={0.5} mb={1}>
          <MenuBookIcon fontSize="small" color="action" />
          <Typography variant="caption" fontWeight={600} color="text.primary">
            {data?.courseType || "Course Type"}
          </Typography>
        </Box> */}

        {/* Subject */}
        <Box display="flex" alignItems="center" gap={0.5} mb={1}>
          <MenuBookIcon fontSize="small" sx={{ color: "primary.main" }} />
          <Typography variant="caption" fontWeight={600} color="text.primary">
            {typeof data?.subject === "object" &&
            data?.subject !== null &&
            "name" in data.subject
              ? (data.subject as ISubject).name
              : "Subject"}
          </Typography>
        </Box>

        {/* Duration */}
        <Box display="flex" alignItems="center" gap={0.5} mb={1}>
          <AccessTimeIcon fontSize="small" sx={{ color: "primary.main" }} />
          <Typography variant="caption" fontWeight={600} color="text.primary">
            {data?.duration || "Duration"}
          </Typography>
        </Box>

        {/* Description */}
        <FormLabel
          sx={{
            color: "primary.main",
            fontSize: "10px",
            fontWeight: 600,
          }}
        >
          Description
        </FormLabel>
        <Typography
          variant="body2"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {data?.description}
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
            mt={2}
        >
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ fontWeight: 600 }}
          >
            Price: $3000
          </Typography>
          {/* View Button */}
          <Button
            variant="contained"
            LinkComponent={Link}
            href={`/courses/${data?._id}`}
            sx={{
              fontWeight: 400,
              borderRadius: 2,
              padding: "5px 10px",
              fontSize: "14px",
            }}
          >
            More Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CoursesCard;
