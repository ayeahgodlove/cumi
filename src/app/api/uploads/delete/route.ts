import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function DELETE(request: NextRequest) {
  try {
    const { fileUrl } = await request.json();
    
    if (!fileUrl) {
      return NextResponse.json(
        { success: false, message: "No file URL provided" },
        { status: 400 }
      );
    }

    // Extract filename from URL
    const filename = fileUrl.split('/').pop();
    if (!filename) {
      return NextResponse.json(
        { success: false, message: "Invalid file URL" },
        { status: 400 }
      );
    }

    // Construct file path
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'media', filename);
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    // Delete the file
    await unlink(filePath);

    return NextResponse.json(
      { 
        success: true, 
        message: "File deleted successfully",
        deletedFile: filename
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("File deletion error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to delete file",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
