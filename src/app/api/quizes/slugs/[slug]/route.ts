import { QuizRepository } from "@data/repositories/impl/quiz.repository";
import { QuizUseCase } from "@domain/usecases/quiz.usecase";
import { QuizMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { NextResponse, NextRequest } from "next/server";

const quizRepository = new QuizRepository();
const quizUseCase = new QuizUseCase(quizRepository);
const quizMapper = new QuizMapper();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    const quiz = await quizUseCase.getQuizBySlug(slug);
    if (!quiz) {
      throw new NotFoundException("Quiz", slug);
    }
    const quizDTO = quizMapper.toDTO(quiz);
    return NextResponse.json(quizDTO);
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
