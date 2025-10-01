import { QuizRepository } from "@data/repositories/impl/quiz.repository";
import { QuizUseCase } from "@domain/usecases/quiz.usecase";
import authOptions from "@lib/options";
import { QuizRequestDto } from "@presentation/dtos/quiz-request.dto";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const quizRepository = new QuizRepository();
const quizUseCase = new QuizUseCase(quizRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');
    const moduleId = searchParams.get('moduleId');
    const courseId = searchParams.get('courseId');

    let quizes;
    if (lessonId) {
      quizes = await quizUseCase.getQuizesByLessonId(lessonId);
    } else if (moduleId) {
      quizes = await quizUseCase.getQuizesByModuleId(moduleId);
    } else if (courseId) {
      quizes = await quizUseCase.getQuizesByCourseId(courseId);
    } else {
      quizes = await quizUseCase.getAll();
    }

    return NextResponse.json({
      data: quizes,
      message: "Quizzes retrieved successfully",
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
    const dto = new QuizRequestDto(body);
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

    const quizResponse = await quizUseCase.createQuiz({
      ...dto.toData(),
      userId,
    });
    return NextResponse.json(
      {
        data: quizResponse.toJSON(),
        message: "quiz created Successfully!",
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

