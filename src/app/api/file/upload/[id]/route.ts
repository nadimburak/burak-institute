import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Permission, { IPermission } from '@/models/user/Permission.model';
import Upload, { IUpload } from '@/models/file/Upload.model';
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

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const body = await request.json();
        const { id } = await context.params;
        const permission: IPermission | null = await Permission.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!permission) {
            return NextResponse.json({ error: 'permission not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: permission });
    } catch (error: unknown) {
        console.log(error);

        // Handle MongoDB validation errors
        if (
            typeof error === 'object' &&
            error !== null &&
            'name' in error &&
            (error as { name: string }).name === 'ValidationError'
        ) {
            const errors =
                'errors' in error
                    ? Object.values((error as { errors: Record<string, { message: string }> }).errors).map((err) => err.message)
                    : [];
            return NextResponse.json(
                { message: 'Validation failed', details: errors },
                { status: 400 }
            );
        }

        // Handle duplicate key errors
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            (error as { code: number }).code === 11000
        ) {
            return NextResponse.json(
                { message: 'Data already exists' },
                { status: 409 }
            );
        }

        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await context.params;
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