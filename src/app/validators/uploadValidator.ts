import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/config/file.config";
import Joi from "joi";

// Validation schema for upload metadata (initial POST request)
export const uploadMetadataSchema = Joi.object({
    file_name: Joi.string()
        .required()
        .max(255)
        .trim()
        .label("File name"),
    file_extension: Joi.string()
        .required()
        .pattern(/^[a-zA-Z0-9]+$/)
        .max(10)
        .label("File extension"),
    file_size: Joi.number()
        .required()
        .positive()
        .max(MAX_FILE_SIZE)
        .label("File size"),
    file_mime_type: Joi.string()
        .required()
        .valid(...ALLOWED_FILE_TYPES)
        .label("MIME type")
});

// Validation schema for chunk headers (PATCH requests)
export const chunkHeadersSchema = Joi.object({
    'upload-offset': Joi.string()
        .required()
        .pattern(/^\d+$/)
        .label("Upload-Offset"),
    'upload-length': Joi.string()
        .required()
        .pattern(/^\d+$/)
        .label("Upload-Length"),
    'upload-name': Joi.string()
        .optional()
        .max(255)
        .label("Upload-Name"),
    'content-type': Joi.string()
        .optional()
        .label("Content-Type")
}).unknown(true); // Allow other headers

// Validate upload metadata
export interface UploadMetadata {
    file_name: string;
    file_extension: string;
    file_size: number;
    file_mime_type: string;
}

export const validateUploadMetadata = (data: UploadMetadata) => {
    return uploadMetadataSchema.validate(data, {
        abortEarly: false,
        allowUnknown: true
    });
};

// Validate chunk headers
export interface ChunkHeaders {
    'upload-offset': string;
    'upload-length': string;
    'upload-name'?: string;
    'content-type'?: string;
    [key: string]: unknown;
}

export const validateChunkHeaders = (headers: ChunkHeaders) => {
    return chunkHeadersSchema.validate(headers, {
        abortEarly: false,
        allowUnknown: true
    });
};

// Validate file ID parameter
export const validateFileId = (id: string) => {
    return Joi.string()
        .required()
        .pattern(/^[a-f0-9]{24}$|^[a-zA-Z0-9_-]+$/)
        .validate(id);
};

// Additional validation helpers
export const validateChunkData = (data: Buffer) => {
    if (!Buffer.isBuffer(data)) {
        return { error: new Error("Chunk data must be a Buffer") };
    }
    if (data.length === 0) {
        return { error: new Error("Chunk data cannot be empty") };
    }
    return { error: null };
};