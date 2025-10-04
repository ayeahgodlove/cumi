import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || 
    process.env.CLOUDINARY_URL?.split(':')[2]?.split('@')[0],
  secure: true,
});

/**
 * Delete image from Cloudinary
 * DELETE /api/cloudinary/delete
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    let { publicId, fileUrl } = body;

    // Extract public ID from URL if not directly provided
    if (!publicId && fileUrl) {
      // Extract from Cloudinary URL format
      // https://res.cloudinary.com/dch9sc7gq/image/upload/v1234567890/cumi/image_name.jpg
      const match = fileUrl.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp|svg)$/i);
      if (match && match[1]) {
        publicId = match[1];
      }
    }

    if (!publicId) {
      return NextResponse.json(
        { success: false, message: "No public ID or file URL provided" },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok' || result.result === 'not found') {
      return NextResponse.json({
        success: true,
        message: "File deleted successfully from Cloudinary",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to delete file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "File deletion failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
