import Lesson from "@data/entities/lesson";
import { LessonRepository } from "@data/repositories/impl/lesson.repository";
import { LessonUseCase } from "@domain/usecases/lesson.usecase";
import { LessonRequestDto } from "@presentation/dtos/lesson-request.dto";
import { LessonMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { NextRequest, NextResponse } from "next/server";

const lessonRepository = new LessonRepository();
const lessonUseCase = new LessonUseCase(lessonRepository);
const lessonMapper = new LessonMapper();

export async function GET(request: any) {
  try {
    const lessons = await Lesson.findAll();

    return NextResponse.json(lessons);
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
  const body = await request.json();
  const dto = new LessonRequestDto(body);
  const validationErrors = await validate(dto);
  const userId = request.headers.get("X-User-Id") || "";

  if (validationErrors.length > 0) {
    return NextResponse.json(
      {
        validationErrors: displayValidationErrors(validationErrors),
        success: false,
        data: null,
        message: "Attention!",
      },
      { status: 400 }
    );
  }

  try {
    const lessonResponse = await lessonUseCase.createLesson({
      ...dto.toData(),
      userId,
    });
    return NextResponse.json(
      {
        data: lessonResponse.toJSON(),
        message: "lesson created Successfully!",
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
