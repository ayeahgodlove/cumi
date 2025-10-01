import { LessonRepository } from "@data/repositories/impl/lesson.repository";
import { LessonUseCase } from "@domain/usecases/lesson.usecase";
import authOptions from "@lib/options";
import { LessonRequestDto } from "@presentation/dtos/lesson-request.dto";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const lessonRepository = new LessonRepository();
const lessonUseCase = new LessonUseCase(lessonRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const courseId = searchParams.get('courseId');

    let lessons;
    if (moduleId) {
      lessons = await lessonUseCase.getLessonsByModuleId(moduleId);
    } else if (courseId) {
      lessons = await lessonUseCase.getLessonsByCourseId(courseId);
    } else {
      lessons = await lessonUseCase.getAll();
    }

    return NextResponse.json({
      data: lessons,
      message: "Lessons retrieved successfully",
      success: true,
    });
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
    const body = await request.json();
    const dto = new LessonRequestDto(body);
    const validationErrors = await validate(dto);
    const userId = session.user.id;

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
    console.log("error:", error);
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

