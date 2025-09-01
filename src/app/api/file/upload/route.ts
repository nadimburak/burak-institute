import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Upload from '@/models/file/Upload.model';
import { startChunkProcess } from '@/lib/file.lib';
import { validateUploadMetadata } from '@/app/validators/uploadValidator';

export async function GET(request: NextRequest, { params }: { params: { load: string } }) {
    try {
        await connectDB();
        const { load } = params;

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
            
            return NextResponse.json({ success: true, data: upload }, { status: 200 });
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

        const body = await request.json();

        // Validate request body
        if (!body || Object.keys(body).length === 0) {
            return NextResponse.json(
                { success: false, message: 'Request body is required' }, 
                { status: 400 }
            );
        }

        const { error } = await validateUploadMetadata(body);
        if (error) {
            return NextResponse.json(
                { success: false, message: error.message }, 
                { status: 400 }
            );
        }

        const {
            file_name: originalName,
            file_extension: extension,
            file_size: size,
            file_mime_type: mimeType,
        } = body;

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
            { success: true, data: upload }, 
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