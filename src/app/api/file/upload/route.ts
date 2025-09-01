import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Upload, { IUpload } from '@/models/file/Upload.model';
import { processChunkUploads, startChunkProcess } from '@/lib/file.lib';
import { validateChunkHeaders, validateUploadMetadata } from '@/app/validators/uploadValidator';
import { UPLOAD_DIR } from '@/config/file.config';
import path from 'path';
import fs from 'fs-extra';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const load = searchParams.get('load'); // Get a specific param


        // If load parameter is provided, filter by file_path
        if (load && typeof load === 'string') {
            const upload = await Upload.findOne({ file_path: load })
                .select('-__v')
                .lean()
                .exec();

            if (!upload) {
                return NextResponse.json(
                    { success: false, message: 'File not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json(upload, { status: 200 });
        }

        // If no load parameter, get all uploads
        const uploads = await Upload.find()
            .select('-__v')
            .lean()
            .exec();

        return NextResponse.json({ success: true, data: uploads }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const formData = await request.formData();
        console.log('Received form data:', formData);

        const originalName = formData.get('file_name');
        const extension = formData.get('file_extension');
        const size = formData.get('file_size');
        const mimeType = formData.get('file_mime_type');


        const { error } = await validateUploadMetadata({
            file_name: originalName as string,
            file_extension: extension as string,
            file_size: Number(size),
            file_mime_type: mimeType as string
        });
        if (error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 400 }
            );
        }



        // Generate unique file name
        const fileName = await startChunkProcess();
        const filePath = `${fileName}.${extension}`;
        const fileUrl = `/uploads/${filePath}`;

        // Create new upload document
        const upload = new Upload({
            file_name: fileName,
            file_original_name: originalName,
            file_extension: extension,
            file_size: size,
            file_mime_type: mimeType,
            file_path: filePath,
            file_disk: "local",
            file_url: fileUrl
        });

        await upload.save();

        return NextResponse.json(
            upload,
            { status: 201 }
        );

    } catch (error: unknown) {
        console.error('Upload creation error:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const patch = searchParams.get('patch'); // Get a specific param

        console.log('Received PATCH request for file ID:', patch);
        // Get headers from the request
        const headers = request.headers;
        const uploadOffset = headers.get('upload-offset');
        const uploadLength = headers.get('upload-length');
        const uploadName = headers.get('upload-name');
        const contentType = headers.get('content-type');

        // Prepare headers object for validation
        const headersObj = {
            'upload-offset': uploadOffset ?? '',
            'upload-length': uploadLength ?? '',
            'upload-name': uploadName ?? '',
            'content-type': contentType ?? ''
        };

        // Validate chunk headers
        const { error } = validateChunkHeaders(headersObj);
        if (error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 400 }
            );
        }

        // Parse headers
        const offset = parseInt(uploadOffset as string, 10);
        const length = parseInt(uploadLength as string, 10);
        const filename = uploadName as string;

        // Get chunk data from request body
        const chunkData = await request.arrayBuffer();
        const buffer = Buffer.from(chunkData);

        // Validate chunk data
        if (buffer.length === 0) {
            return NextResponse.json(
                { success: false, message: "Chunk data cannot be empty" },
                { status: 400 }
            );
        }

        // Ensure patch is a string
        if (!patch || typeof patch !== 'string') {
            return NextResponse.json(
                { success: false, message: "Invalid file ID" },
                { status: 400 }
            );
        }

        // Process the chunk upload
        await processChunkUploads({
            fileId: patch,
            offset,
            length,
            filename,
            chunkData: buffer
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Chunk uploaded successfully',
                fileId: patch,
                fileName: filename,
                offset: offset + buffer.length
            },
            {
                status: 200,
                headers: {
                    'Upload-Offset': (offset + buffer.length).toString()
                }
            }
        );

    } catch (error: unknown) {
        console.error('Chunk upload error:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
        );
    }
}

export async function HEAD(
    request: NextRequest
) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const patch = searchParams.get('patch'); // Get a specific param

        console.log('Received PATCH request for file ID:', patch);

        // Get headers from the request
        const headers = request.headers;
        const uploadOffset = headers.get('upload-offset');
        const uploadLength = headers.get('upload-length');
        const uploadName = headers.get('upload-name');
        const contentType = headers.get('content-type');

        // Prepare headers object for validation
        const headersObj = {
            'upload-offset': uploadOffset ?? '',
            'upload-length': uploadLength ?? '',
            'upload-name': uploadName ?? '',
            'content-type': contentType ?? ''
        };

        // Validate chunk headers
        const { error } = validateChunkHeaders(headersObj);
        if (error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 400 }
            );
        }

        // Parse headers
        const offset = parseInt(uploadOffset as string, 10);
        const length = parseInt(uploadLength as string, 10);
        const filename = uploadName as string;

        // Get chunk data from request body
        const chunkData = await request.arrayBuffer();
        const buffer = Buffer.from(chunkData);

        // Validate chunk data
        if (buffer.length === 0) {
            return NextResponse.json(
                { success: false, message: "Chunk data cannot be empty" },
                { status: 400 }
            );
        }

        // Ensure patch is a string
        if (!patch || typeof patch !== 'string') {
            return NextResponse.json(
                { success: false, message: "Invalid file ID" },
                { status: 400 }
            );
        }

        // Process the chunk upload
        await processChunkUploads({
            fileId: patch,
            offset,
            length,
            filename,
            chunkData: buffer
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Chunk uploaded successfully',
                fileId: patch,
                fileName: filename,
                offset: offset + buffer.length
            },
            {
                status: 200,
                headers: {
                    'Upload-Offset': (offset + buffer.length).toString()
                }
            }
        );

    } catch (error: unknown) {
        console.error('Chunk upload error:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        const id = await request.text();
        const deletedData: IUpload | null = await Upload.findOneAndDelete({ file_path: id });

        if (!deletedData) {
            return NextResponse.json({ error: 'Data not found' }, { status: 404 });
        }

        const filePath = path.join(UPLOAD_DIR, deletedData.file_path);
        if (await fs.pathExists(filePath)) {
            await fs.unlink(filePath);
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
}