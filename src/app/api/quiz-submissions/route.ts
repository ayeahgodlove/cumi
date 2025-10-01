import { QuizSubmissionRepository } from "@data/repositories/impl/quiz-submission.repository";
import { QuizSubmissionUseCase } from "@domain/usecases/quiz-submission.usecase";
import { QuizSubmissionMapper } from "@presentation/mappers/mapper";
import { QuizSubmissionRequestDto } from "@presentation/dtos/quiz-submission-request.dto";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { NextRequest, NextResponse } from "next/server";
import { validate } from "class-validator";
import { nanoid } from "nanoid";

export const dynamic = 'force-dynamic';

const quizSubmissionRepository = new QuizSubmissionRepository();
const quizSubmissionUseCase = new QuizSubmissionUseCase(quizSubmissionRepository);
const quizSubmissionMapper = new QuizSubmissionMapper();

export async function POST(request: NextRequest) {
  let session;
  
  try {
    session = await getServerSession(authOptions);
  } catch (sessionError: any) {
    console.error("Session decryption error:", sessionError);
    return NextResponse.json(
      {
        message: "Session error: Please clear your browser cookies and log in again.",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Unauthorized: Please log in to submit a quiz.",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    
    // Create DTO and validate
    const submissionDto = new QuizSubmissionRequestDto({
      ...body,
      id: nanoid(20),
      userId: session.user.id,
      submittedAt: new Date(),
      gradedAt: new Date(),
      status: 'graded',
    });

    const errors = await validate(submissionDto);
    if (errors.length > 0) {
      const validationErrors = errors.map(error => ({
        field: error.property,
        message: Object.values(error.constraints || {}).join(", "),
      }));

      return NextResponse.json(
        {
          message: "Validation failed",
          success: false,
          data: null,
          validationErrors,
        },
        { status: 400 }
      );
    }

    // Submit quiz
    const submission = await quizSubmissionUseCase.submitQuiz(submissionDto as any);
    const submissionData = quizSubmissionMapper.toDTO(submission);

    return NextResponse.json(
      {
        data: submissionData,
        message: "Quiz submitted successfully!",
        success: true,
        validationErrors: [],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to submit quiz",
        success: false,
        validationErrors: [],
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");
    const quizId = searchParams.get("quizId");

    let submissions;

    if (userId && courseId) {
      // Get user's quiz performance for a course
      submissions = await quizSubmissionUseCase.getUserQuizPerformance(userId, courseId);
    } else if (userId) {
      // Get all user's quiz submissions
      submissions = await quizSubmissionUseCase.getUserQuizSubmissions(userId);
    } else if (quizId) {
      // Get all submissions for a specific quiz
      submissions = await quizSubmissionUseCase.getQuizSubmissions(quizId);
    } else if (courseId) {
      // Get all submissions for a course
      submissions = await quizSubmissionUseCase.getCourseQuizSubmissions(courseId);
    } else {
      return NextResponse.json(
        {
          message: "Please provide userId, courseId, or quizId parameter",
          success: false,
          data: null,
          validationErrors: [],
        },
        { status: 400 }
      );
    }

    const submissionsData = quizSubmissionMapper.toDTOs(submissions);

    return NextResponse.json(
      {
        data: submissionsData,
        message: "Quiz submissions retrieved successfully",
        success: true,
        validationErrors: [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching quiz submissions:", error);
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to fetch quiz submissions",
        success: false,
        validationErrors: [],
      },
      { status: 500 }
    );
  }
}

