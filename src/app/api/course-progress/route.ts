import { CourseProgressRepository } from "@data/repositories/impl/course-progress.repository";
import { CourseProgressUseCase } from "@domain/usecases/course-progress.usecase";
import authOptions from "@lib/options";
import { CourseProgressRequestDto } from "@presentation/dtos/course-progress-request.dto";
import { CourseProgressMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { notificationService } from "@services/notification.service";
import { courseUseCase } from "@domain/usecases/course.usecase";
import { lessonUseCase } from "@domain/usecases/lesson.usecase";

const courseProgressRepository = new CourseProgressRepository();
const courseProgressUseCase = new CourseProgressUseCase(courseProgressRepository);
const courseProgressMapper = new CourseProgressMapper();

export async function GET(request: any) {
  try {
    const courseProgress = await courseProgressUseCase.getAll();
    const courseProgressDto = courseProgressMapper.toDTOs(courseProgress);
    return NextResponse.json(courseProgressDto);
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
  const session = await getServerSession(authOptions);

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
    const dto = new CourseProgressRequestDto(body);
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

    const courseProgressResponse = await courseProgressUseCase.createCourseProgress({
      ...dto.toData(),
      userId,
    });

    // Send progress notification email based on progress type
    try {
      const progressData = dto.toData();
      
      if (progressData.progressType === 'lesson_completed') {
        const lesson = await lessonUseCase.getLessonById(progressData.lessonId);
        const course = await courseUseCase.getCourseById(progressData.courseId);
        
        if (lesson && course) {
          await notificationService.notifyLessonCompletion(
            userId,
            lesson.title,
            course.title,
            `/courses/${course.id}/lessons/${lesson.id}`
          );
        }
      } else if (progressData.progressType === 'course_completed') {
        const course = await courseUseCase.getCourseById(progressData.courseId);
        
        if (course) {
          await notificationService.notifyCourseCompletion(
            userId,
            course.title,
            `/courses/${course.id}/certificate`
          );
        }
      } else if (progressData.progressType === 'quiz_completed') {
        const course = await courseUseCase.getCourseById(progressData.courseId);
        
        if (course) {
          await notificationService.notifyQuizCompletion(
            userId,
            'Quiz',
            progressData.progress || 0,
            course.title
          );
        }
      }
    } catch (emailError) {
      console.error("Failed to send progress notification:", emailError);
      // Don't fail the progress update if email fails
    }

    return NextResponse.json(
      {
        data: courseProgressResponse.toJSON(),
        message: "Course progress created Successfully!",
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
