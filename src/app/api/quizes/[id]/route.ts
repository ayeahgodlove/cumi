import { QuizRepository } from "@data/repositories/impl/quiz.repository";
import { emptyQuiz, IQuiz } from "@domain/models/quiz";
import { QuizUseCase } from "@domain/usecases/quiz.usecase";
import { QuizRequestDto } from "@presentation/dtos/quiz-request.dto";
import { QuizMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { NextResponse, NextRequest } from "next/server";

const quizRepository = new QuizRepository();
const quizUseCase = new QuizUseCase(quizRepository);
const quizMapper = new QuizMapper();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const dto = new QuizRequestDto(await req.json());
  const validationErrors = await validate(dto);
  const userId = req.headers.get("X-User-Id") || "";

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
  } else {
    try {
      const id = params.id;
      const obj: IQuiz = {
        ...emptyQuiz,
        ...dto.toData(),
        id: id,
      };
      const updatedQuiz = await quizUseCase.updateQuiz(obj);
      const quizDto = quizMapper.toDTO(updatedQuiz);

      return NextResponse.json(
        {
          data: quizDto,
          message: "Quiz Updated Successfully!",
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
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const quiz = await quizUseCase.getQuizById(id);
    if (!quiz) {
      throw new NotFoundException("Quiz", id);
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    await quizUseCase.deleteQuiz(id);

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
