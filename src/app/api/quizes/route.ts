import Quiz from "@data/entities/quiz";
import { QuizRepository } from "@data/repositories/impl/quiz.repository";
import { QuizUseCase } from "@domain/usecases/quiz.usecase";
import { QuizRequestDto } from "@presentation/dtos/quiz-request.dto";
import { QuizMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { NextRequest, NextResponse } from "next/server";

const quizRepository = new QuizRepository();
const quizUseCase = new QuizUseCase(quizRepository);
const quizMapper = new QuizMapper();

export async function GET(request: any) {
  try {
    const categories = await Quiz.findAll();

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
  const body = await request.json();
  const dto = new QuizRequestDto(body);
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
    const quizResponse = await quizUseCase.createQuiz({
      ...dto.toData(),
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
