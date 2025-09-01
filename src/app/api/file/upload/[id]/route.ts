import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Upload from '@/models/file/Upload.model';
import { UPLOAD_DIR } from '@/config/file.config';
import path from 'path';
import fs from 'fs-extra';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await context.params;
        const upload = await Upload.findOne({ file_path: id });

        if (!upload) {
            return NextResponse.json({ message: 'File not found' }, { status: 404 });
        }

        const filePath = path.join(UPLOAD_DIR, upload.file_path);
        if (!await fs.pathExists(filePath)) {
            return NextResponse.json({ message: 'File not found on server' }, { status: 404 });
        }

        const fileBuffer = await fs.readFile(filePath);
        const response = new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': upload.file_mime_type,
                'Content-Disposition': `inline; filename="${upload.file_original_name}"`,
                'Content-Length': upload.file_size.toString()
            }
        });
        return response;

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
}