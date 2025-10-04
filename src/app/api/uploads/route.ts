import { NextRequest, NextResponse } from "next/server";

// Maximum file size: 5MB (Cloudinary free tier allows up to 10MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Allowed file types
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

/**
 * Upload image to Cloudinary
 * POST /api/uploads
 */
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

    // Upload to Cloudinary
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Cloudinary configuration missing"
        },
        { status: 500 }
      );
    }

    // Create form data for Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", file);
    cloudinaryFormData.append("upload_preset", uploadPreset);
    cloudinaryFormData.append("folder", "cumi"); // Try to override preset folder
    
    // IMPORTANT: If using unsigned preset, the folder in the preset settings takes priority
    // Go to Cloudinary dashboard and change the preset folder from "linkavet/uploads" to "cumi"
    // https://console.cloudinary.com/console/dch9sc7gq/settings/upload

    // Upload to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: "POST",
      body: cloudinaryFormData,
    });

    if (!cloudinaryResponse.ok) {
      const errorData = await cloudinaryResponse.json();
      throw new Error(errorData.error?.message || "Cloudinary upload failed");
    }

    const cloudinaryData = await cloudinaryResponse.json();
    
    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully to Cloudinary",
        url: cloudinaryData.secure_url,
        publicId: cloudinaryData.public_id,
        filename: cloudinaryData.public_id,
        originalName: file.name,
        size: file.size,
        type: file.type,
        width: cloudinaryData.width,
        height: cloudinaryData.height
      },
      { status: 200 }
    );

  } catch (error) {
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
