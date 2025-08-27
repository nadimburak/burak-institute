import { ActualFileObject } from "filepond";

export interface FileUpload {
    options?: object;
    origin?: string;
    file_path: string;
    file_original_name: string;
    file_size: number;
    file_mime_type: string;
    file_url: string;
}

export interface FilePondFileItem {
    source: string | ActualFileObject;
    options: {
        type: string;
        file: {
            name: string;
            size: number;
            type: string;
        };
        metadata: {
            poster: unknown;
        };
    };
}