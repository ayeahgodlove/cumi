import { CourseProgressRepository } from "@data/repositories/impl/course-progress.repository";
import { CourseProgressUseCase } from "@domain/usecases/course-progress.usecase";
import { CourseProgressMapper } from "@presentation/mappers/mapper";
import { CourseProgressRequestDto } from "@presentation/dtos/course-progress-request.dto";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

const courseProgressRepository = new CourseProgressRepository();
const courseProgressUseCase = new CourseProgressUseCase(courseProgressRepository);
const courseProgressMapper = new CourseProgressMapper();

// GET - Fetch lesson progress for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        message: "Unauthorized: Please log in to access this resource.",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  try {
    const { id: lessonId } = params;
    const userId = session.user.id;

    // Get lesson progress for the user
    const progressRecords = await courseProgressUseCase.getCourseProgressByLessonId(lessonId);
    const userProgress = progressRecords.find(progress => 
      progress.getDataValue('userId') === userId && 
      progress.getDataValue('progressType') === 'lesson'
    );

    const progressData = userProgress ? courseProgressMapper.toDTO(userProgress) : null;

    return NextResponse.json(
      {
        data: progressData,
        message: "Lesson progress retrieved successfully",
        success: true,
        validationErrors: [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof NotFoundException) {
      return NextResponse.json(
        {
          message: error.message,
          success: false,
          data: null,
          validationErrors: [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to fetch lesson progress",
        success: false,
        validationErrors: [],
      },
      { status: 500 }
    );
  }
}

// POST - Mark lesson as completed or update progress
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        message: "Unauthorized: Please log in to access this resource.",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  try {
    const { id: lessonId } = params;
    const userId = session.user.id;
    const body = await request.json();
    
    // Create DTO and validate
    const progressDto = new CourseProgressRequestDto({
      ...body,
      lessonId,
      userId,
      progressType: 'lesson',
      id: nanoid(20)
    });

    const errors = await validate(progressDto);
    if (errors.length > 0) {
      return NextResponse.json(
        {
          message: "Validation failed",
          success: false,
          data: null,
          validationErrors: displayValidationErrors(errors),
        },
        { status: 400 }
      );
    }

    // Check if progress record already exists
    const existingProgressRecords = await courseProgressUseCase.getCourseProgressByLessonId(lessonId);
    const existingProgress = existingProgressRecords.find(progress => 
      progress.getDataValue('userId') === userId && 
      progress.getDataValue('progressType') === 'lesson'
    );

    let result;
    if (existingProgress) {
      // Update existing progress
      const updateData = progressDto.toUpdateData(courseProgressMapper.toDTO(existingProgress));
      result = await courseProgressUseCase.updateCourseProgress(updateData);
    } else {
      // Create new progress record
      const progressData = progressDto.toData();
      result = await courseProgressUseCase.createCourseProgress(progressData);
    }

    const responseData = courseProgressMapper.toDTO(result);

    return NextResponse.json(
      {
        data: responseData,
        message: body.isCompleted ? "Lesson marked as completed!" : "Lesson progress updated!",
        success: true,
        validationErrors: [],
      },
      { status: existingProgress ? 200 : 201 }
    );
  } catch (error: any) {
    if (error instanceof NotFoundException) {
      return NextResponse.json(
        {
          message: error.message,
          success: false,
          data: null,
          validationErrors: [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to update lesson progress",
        success: false,
        validationErrors: [],
      },
      { status: 500 }
    );
  }
}
