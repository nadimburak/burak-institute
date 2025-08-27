import { FileUpload } from "@/interfaces/file.pond.interface";
import {
  Notification,
  NotificationType,
} from "@/interfaces/notification.interface";
import { Alert, Box, CircularProgress, Icon, IconButton } from "@mui/material";
import axios from "axios";
import {
  FilePondErrorDescription,
  FilePondFile,
  FilePondInitialFile,
} from "filepond";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginFilePoster from "filepond-plugin-file-poster";
import "filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import "filepond/dist/filepond.min.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";

registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
  FilePondPluginFilePoster
);

interface ImageFileUploadProps {
  value: string;
  maxFileSize?: string;
  maxFiles?: number;
  setValue: (value: string) => void;
  allowedFileTypes?: string[];
}

const ImageFileUpload = ({
  value,
  setValue,
  maxFileSize = "10MB",
  maxFiles = 1,
  allowedFileTypes = ["image/jpeg", "image/png", "image/svg+xml"],
}: ImageFileUploadProps) => {
  const token = "11";
  const uploadUrl = `${process.env.NEXT_PUBLIC_UPLOAD_URL}/single-file-pond/upload`;
  const [files, setFiles] = useState<
    (string | FilePondInitialFile | Blob | File)[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const csrfToken = (
    document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null
  )?.content;
  const [notification, setNotification] = useState<Notification | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pond = useRef<FilePond>(null);
  const uploadInProgress = useRef(false);

  const CHUNK_SIZE = 1 * 1024 * 1024;
  const RETRY_DELAY = 1000;

  const showNotification = useCallback(
    (type: NotificationType, message: string) => {
      setNotification({ type, message });
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    },
    []
  );

  const getFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      if (value) {
        const response = await axios.get(`${uploadUrl}`, {
          params: { load: value },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const file = response.data as FileUpload;
        if (!file || !file.file_path) {
          showNotification("error", "File not found");
          return;
        }
        if (pond.current) {
          pond.current.removeFiles();
        }

        // Construct proper file URL
        const fileUrl = file.file_path.startsWith("http")
          ? file.file_path
          : `${process.env.NEXT_PUBLIC_UPLOAD_URL}/uploads/${file.file_path}`;

        console.log("File URL:", fileUrl);

        setFiles([
          {
            source: file.file_path,
            options: {
              type: "local" as const,
              file: {
                name: file.file_original_name,
                size: file.file_size,
                type: file.file_mime_type,
              },
              metadata: {
                poster: fileUrl,
              },
            },
          },
        ]);
      } else {
        setFiles([]);
      }
    } catch (error) {
      console.error("Error loading files:", error);
      showNotification("error", "Failed to load files");
    } finally {
      setIsLoading(false);
    }
  }, [value, token, uploadUrl, showNotification]);

  useEffect(() => {
    getFiles();
  }, [getFiles]);

  useEffect(() => {
    const pondInstance = pond.current;
    return () => {
      if (pondInstance) {
        pondInstance.removeFiles();
      }
    };
  }, []);

  const handleUpdateFiles = useCallback((fileItems: FilePondFile[]) => {
    const newFiles = fileItems.map((fileItem) => fileItem.file);
    setFiles((prevFiles) => {
      if (JSON.stringify(newFiles) !== JSON.stringify(prevFiles)) {
        return newFiles;
      }
      return prevFiles;
    });
  }, []);

  const handleProcessFile = useCallback(
    (error: FilePondErrorDescription | null, file: FilePondFile) => {
      console.log("handleProcessFile", error, file);
      if (error) {
        showNotification("error", `Error processing file: ${file.filename}`);
        uploadInProgress.current = false;
        return;
      }

      setValue(file.serverId);
      showNotification(
        "success",
        `File processed successfully: ${file.filename}`
      );
      uploadInProgress.current = false;
    },
    [setValue, showNotification]
  );

  const handleServerProcess = useCallback((formData: FormData): FormData => {
    if (uploadInProgress.current) return formData;

    const file = pond.current?.getFile();
    if (!file) return formData;

    uploadInProgress.current = true;

    formData.append("_method", "POST");
    formData.append("file_name", file.filename);
    formData.append("file_mime_type", file.fileType);
    formData.append("file_extension", file.fileExtension);
    formData.append("file_size", file.fileSize.toString());

    return formData;
  }, []);

  const handleServerLoad = useCallback(
    (data: unknown) => {
      uploadInProgress.current = false;
      console.log("handleServerLoad", data);
      if (typeof data === "object" && data !== null && "response" in data) {
        const { response } = data as { response: string };
        try {
          const parsed = JSON.parse(response);
          if (parsed?.file_path) {
            return parsed.file_path;
          }
          showNotification("error", "Upload failed: Invalid response");
        } catch {
          showNotification("error", "Upload failed: Could not parse response");
        }
      } else {
        showNotification("error", "Upload failed: Invalid data format");
      }
      return null;
    },
    [showNotification]
  );

  const handleServerError = useCallback(
    (response: unknown) => {
      uploadInProgress.current = false;
      try {
        const data =
          typeof response === "string" ? JSON.parse(response) : response;
        showNotification("error", data?.errors?.file?.[0] || "Upload failed");
      } catch {
        showNotification("error", "Upload failed");
      }
    },
    [showNotification]
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        width: "100%",
        transition: "margin 0.3s ease",
      }}
    >
      {notification && (
        <Alert
          sx={{ mb: 2 }}
          severity={notification.type}
          action={
            <IconButton size="small" onClick={() => setNotification(null)}>
              <Icon>close</Icon>
            </IconButton>
          }
        >
          {notification.message}
        </Alert>
      )}
      <FilePond
        allowImagePreview={true}
        imagePreviewMaxHeight={200}
        allowFilePoster={true}
        filePosterMaxHeight={200}
        className="custom-filepond"
        labelFileProcessing="Uploading"
        labelFileProcessingComplete="Upload completed"
        labelFileProcessingError="Error during upload"
        ref={pond}
        files={files}
        onupdatefiles={handleUpdateFiles}
        allowMultiple={maxFiles > 1}
        maxFiles={maxFiles}
        allowFileEncode={true}
        allowImageResize={true}
        imageResizeMode="force"
        imageResizeUpscale={true}
        maxFileSize={maxFileSize}
        chunkUploads={true}
        chunkSize={CHUNK_SIZE}
        chunkForce={true}
        chunkRetryDelays={[RETRY_DELAY, RETRY_DELAY * 2, RETRY_DELAY * 3]}
        acceptedFileTypes={allowedFileTypes}
        onprocessfile={handleProcessFile}
        server={{
          url: uploadUrl,
          timeout: 7000,
          process: {
            url: "/",
            // method: "POST",
            headers: {
              ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            ondata: handleServerProcess,
            onload: handleServerLoad,
            onerror: handleServerError,
          },
        }}
        name="file"
        aria-label="File upload"
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span><br><small>Please upload files in JPEG, JPG, PNG, or SVG format only (Max 10MB)</small>'
        labelFileTypeNotAllowed="File of invalid type"
        fileValidateTypeLabelExpectedTypes="Expects {allButLastType} or {lastType}"
        labelMaxFileSizeExceeded="File is too large"
        labelMaxFileSize="Maximum file size is {filesize}"
        credits={false}
      />
    </Box>
  );
};

export default React.memo(ImageFileUpload);
