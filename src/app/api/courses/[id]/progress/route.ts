import { CourseProgressRepository } from "@data/repositories/impl/course-progress.repository";
import { CourseProgressUseCase } from "@domain/usecases/course-progress.usecase";
import { CourseProgressMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { NextRequest, NextResponse } from "next/server";

const courseProgressRepository = new CourseProgressRepository();
const courseProgressUseCase = new CourseProgressUseCase(courseProgressRepository);
const courseProgressMapper = new CourseProgressMapper();

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
    const { id: courseId } = params;
    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const includeLastAccessed = searchParams.get("includeLastAccessed") === "true";

    // Get user's progress for this course
    const progressRecords = await courseProgressUseCase.getCourseProgressByCourseId(courseId);
    
    // Filter by user ID and transform to DTOs
    const userProgressRecords = progressRecords
      .filter(progress => progress.getDataValue('userId') === userId)
      .map(progress => courseProgressMapper.toDTO(progress));

    let lastAccessedLesson = null;
    if (includeLastAccessed) {
      // Find the most recently accessed lesson
      const lessonProgressRecords = userProgressRecords
        .filter(record => record.progressType === 'lesson' && record.lastAccessedAt)
        .sort((a, b) => new Date(b.lastAccessedAt || 0).getTime() - new Date(a.lastAccessedAt || 0).getTime());
      
      if (lessonProgressRecords.length > 0) {
        lastAccessedLesson = {
          lessonId: lessonProgressRecords[0].lessonId,
          lastAccessedAt: lessonProgressRecords[0].lastAccessedAt,
          completionPercentage: lessonProgressRecords[0].completionPercentage
        };
      }
    }

    return NextResponse.json(
      {
        data: userProgressRecords,
        lastAccessedLesson,
        message: "Course progress retrieved successfully",
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
        message: error.message || "Failed to fetch course progress",
        success: false,
        validationErrors: [],
      },
      { status: 500 }
    );
  }
}
