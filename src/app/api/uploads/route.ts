// app/api/upload/route.ts
import { existsSync } from "fs";
import { readdir, unlink, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const POST = async (request: NextRequest) => {
  try {
    const file = await request.formData();

    const image: any = file.get("file");

    const byteLength = await image.arrayBuffer();

    const bufferData: any = await Buffer.from(byteLength);

    const pathOfImage = `./public/uploads/media/${image.name}`;

    writeFile(pathOfImage, bufferData);

    return NextResponse.json(
      {
        message: "image upload successfully",
        data: pathOfImage,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { success: false, message: "File upload failed" },
      { status: 500 }
    );
  }
};
