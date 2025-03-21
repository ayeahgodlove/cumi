import { MediaRepository } from "@data/repositories/impl/media.repository";
import { emptyMedia, IMedia } from "@domain/models/media.model";
import { MediaUseCase } from "@domain/usecases/media.usecase";
import authOptions from "@lib/options";
import { MediaRequestDto } from "@presentation/dtos/media-request.dto";
import { MediaMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

const mediaRepository = new MediaRepository();
const mediaUseCase = new MediaUseCase(mediaRepository);
const mediaMapper = new MediaMapper();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions); //get session info

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Unauthorized: Please log in to access this resource.",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  try {
    const data = await req.json();
    const imageUrl = data.imageUrl[0].name;

    const dto = new MediaRequestDto(data.title, imageUrl);
    const validationErrors = await validate(dto);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          validationErrors: displayValidationErrors(validationErrors) as any,
          success: false,
          data: null,
          message: "Attention!",
        },
        { status: 400 }
      );
    }

    const id = params.id;
    const obj: IMedia = {
      ...emptyMedia,
      ...dto.toData(),
      id: id,
    };
    const updatedMedia = await mediaUseCase.updateMedia(obj);
    const mediaDto = mediaMapper.toDTO(updatedMedia);

    return NextResponse.json(
      {
        data: mediaDto,
        message: "Media Updated Successfully!",
        validationErrors: [],
        success: true,
      },
      { status: 200 }
    );
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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const media = await mediaUseCase.getMediaById(id);
    if (!media) {
      throw new NotFoundException("Media", id);
    }
    const mediaDTO = mediaMapper.toDTO(media);
    return NextResponse.json(mediaDTO);
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    await mediaUseCase.deleteMedia(id);

    return NextResponse.json({
      message: `Operation successfully completed!`,
      validationErrors: [],
      success: true,
      data: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
        data: null,
        validationErrors: [error],
        success: true,
      },
      { status: 400 }
    );
  }
}
