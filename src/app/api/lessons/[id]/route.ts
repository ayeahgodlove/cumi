import Lesson from "@data/entities/lesson";
import { LessonRepository } from "@data/repositories/impl/lesson.repository";
import { emptyLesson, ILesson } from "@domain/models/lesson";
import { LessonUseCase } from "@domain/usecases/lesson.usecase";
import authOptions from "@lib/options";
import { LessonRequestDto } from "@presentation/dtos/lesson-request.dto";
import { LessonMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

const lessonRepository = new LessonRepository();
const lessonUseCase = new LessonUseCase(lessonRepository);
const lessonMapper = new LessonMapper();

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
    const dto = new LessonRequestDto(await req.json());
    const validationErrors = await validate(dto);
    const userId = session.user.id;

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
    const obj: ILesson = {
      ...emptyLesson,
      ...dto.toData(),
      id: id,
      userId,
    };
    const updatedLesson = await lessonUseCase.updateLesson(obj);
    const lessonDto = lessonMapper.toDTO(updatedLesson);

    return NextResponse.json(
      {
        data: lessonDto,
        message: "Lesson Updated Successfully!",
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

    const lesson = await lessonUseCase.getLessonById(id);
    if (!lesson) {
      throw new NotFoundException("Lesson", id);
    }
    const lessonDTO = lessonMapper.toDTO(lesson);
    return NextResponse.json(lessonDTO);
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

    await lessonUseCase.deleteLesson(id);

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
