import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Upload from '@/models/Upload';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH || '', 'tmp/chunk');

export async function GET(request: NextRequest, { params }: { params: { load: string } }) {
    try {
        await connectDB();
        const { load } = params;

        // If load parameter is provided, filter by file_path
        if (load && typeof load === 'string') {
            const uploads = await Upload.findOne({ file_path: load })
                .select('-__v')
                .lean()
                .exec(); // Adding .exec() for better promise handling
            return NextResponse.json({ success: true, data: uploads }, { status: 200 });
        }

        // If no load parameter, get all uploads
        const uploads = await Upload.find()
            .select('-__v')
            .lean()
            .exec();

        return NextResponse.json({ success: true, data: uploads }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const formData = await request.formData();
        const file = formData.get('chunkfile') as File;
        const offset = parseFloat(request.headers.get('Upload-Offset') || '0');
        const length = parseFloat(request.headers.get('Upload-Length') || '0');
        const name = request.headers.get('Upload-Name') || 'file';
        const folderName = formData.get('patch') as string; // Unique ID from initial POST

        if (!file) {
            return NextResponse.json({ error: 'No file found' }, { status: 400 });
        }

        // Create directory for chunks
        const chunkDir = path.join(UPLOAD_DIR, folderName);
        if (!fs.existsSync(chunkDir)) {
            fs.mkdirSync(chunkDir, { recursive: true });
        }

        // Save chunk
        const chunkPath = path.join(chunkDir, `chunk_${offset}`);
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(chunkPath, buffer);

        // Check if upload is complete
        if (offset + buffer.length >= length) {
            await combineChunks(chunkDir, name, folderName);
            return NextResponse.json(folderName, { status: 200 });
        }

        return new NextResponse(null, { status: 204 }); // Continue upload

    } catch (error: unknown) {
        console.log(error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
}

const combineChunks = async (chunkDir: string, filename: string, folderName: string) => {
    const finalPath = path.join(UPLOAD_DIR, '..', 'final', `${folderName}_${filename}`);
    const chunks = fs.readdirSync(chunkDir).sort((a, b) => {
        const aOffset = parseInt(a.split('_')[1]);
        const bOffset = parseInt(b.split('_')[1]);
        return aOffset - bOffset;
    });

    const writeStream = fs.createWriteStream(finalPath);
    for (const chunk of chunks) {
        const chunkBuffer = fs.readFileSync(path.join(chunkDir, chunk));
        writeStream.write(chunkBuffer);
    }
    writeStream.end();

    // Cleanup chunks
    fs.rmSync(chunkDir, { recursive: true });
};