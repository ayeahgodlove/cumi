import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// Maximum file size: 1MB
const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

// Allowed file types
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

// Generate unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, extension);
  
  return `${nameWithoutExt}_${timestamp}_${randomString}${extension}`;
}

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          message: `File size exceeds 1MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB` 
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'media');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(file.name);
    const filePath = path.join(uploadDir, uniqueFilename);

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Write file
    await writeFile(filePath, new Uint8Array(buffer));

    // Return success response with proper URL
    const fileUrl = `/uploads/media/${uniqueFilename}`;
    
    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully",
        url: fileUrl,
        filename: uniqueFilename,
        originalName: file.name,
        size: file.size,
        type: file.type
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "File upload failed",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
};
