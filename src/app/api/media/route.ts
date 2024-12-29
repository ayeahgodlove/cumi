import Media from "@data/entities/media";
import { MediaRepository } from "@data/repositories/impl/media.repository";
import { MediaUseCase } from "@domain/usecases/media.usecase";
import { MediaRequestDto } from "@presentation/dtos/media-request.dto";
import { MediaMapper } from "@presentation/mappers/mapper";
import { File } from "buffer";
import { validate } from "class-validator";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const mediaRepository = new MediaRepository();
const mediaUseCase = new MediaUseCase(mediaRepository);
const mediaMapper = new MediaMapper();

export async function GET(request: any) {
  try {
    const categories = await Media.findAll();

    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message,
        validationErrors: [error],
        success: false,
      },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const imageUrl = data.imageUrl[0].name;

  const dto = new MediaRequestDto(data.title, imageUrl);
  const validationErrors = await validate(dto);
  if (validationErrors.length > 0) {
    return NextResponse.json(
      {
        validationErrors: [
          "Image Title is missing!",
          "Image is probably missing too!",
        ],
        success: false,
        data: null,
        message: "Title or file missing!",
      },
      { status: 400 }
    );
  }

  try {
    const mediaResponse = await mediaUseCase.createMedia(dto.toData());

    return NextResponse.json(
      {
        data: mediaMapper.toDTO(mediaResponse),
        message: "media created Successfully!",
        validationErrors: [],
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message,
        validationErrors: [],
        success: false,
      },
      { status: 400 }
    );
  }
}
