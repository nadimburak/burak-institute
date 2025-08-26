import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Paper } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axiosInstance from "@/utils/axiosInstance";

interface FileUploadProps {
  setValue: (files: any) => void; // Function to update the parent state
  value: any; // Current value of files from the parent
}

const FileUpload: React.FC<FileUploadProps> = ({ setValue, value }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter files to only allow PDF, PNG, and DOC
    const filteredFiles = acceptedFiles.filter((file) =>
      ["application/pdf", "image/png", "application/msword"].includes(file.type)
    );

    console.log("filteredFiles", filteredFiles);

    uploadFile(filteredFiles);
  }, []);

  const uploadFile = async (files: File[] | null) => {
    if (!files || files.length === 0) {
      console.error("No files selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const response = await axiosInstance.post("/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure proper content type
        },
        // Cast config to any to allow onUploadProgress
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      } as any);

      const { data, status } = response;

      if (status == 200) {
        const { file } = data as { file?: { path?: string } };
        if (file?.path) {
          setValue(`${process.env.NEXT_PUBLIC_BASE_URL}${file.path}`);
        }
      }

      console.log("Upload successful:", data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "application/msword": [".doc"],
    },
  });

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          border: "2px dashed #ccc",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragActive ? "#f0f0f0" : "#fff",
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 40, color: "#3f51b5" }} />
        <Typography variant="body1">
          {isDragActive
            ? "Drop the files here..."
            : "Drag and drop files here, or click to select files"}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          (Only .pdf, .png, and .doc files are allowed)
        </Typography>
      </Paper>
    </Box>
  );
};

export default FileUpload;
