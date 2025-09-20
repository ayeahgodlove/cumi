import { ModuleRepository } from "@data/repositories/impl/module.repository";
import { CourseProgressRepository } from "@data/repositories/impl/course-progress.repository";
import { ModuleUseCase } from "@domain/usecases/module.usecase";
import { CourseProgressUseCase } from "@domain/usecases/course-progress.usecase";
import { ModuleMapper, CourseProgressMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { NextRequest, NextResponse } from "next/server";

const moduleRepository = new ModuleRepository();
const courseProgressRepository = new CourseProgressRepository();
const moduleUseCase = new ModuleUseCase(moduleRepository);
const courseProgressUseCase = new CourseProgressUseCase(courseProgressRepository);
const moduleMapper = new ModuleMapper();
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

    // Get modules with lessons using the repository layer
    const modules = await moduleUseCase.getModulesByCourseIdWithLessons(courseId);

    if (!modules || modules.length === 0) {
      return NextResponse.json(
        {
          message: "No modules found for this course",
          success: true,
          data: [],
          validationErrors: [],
        },
        { status: 200 }
      );
    }

    // Get user's progress for this course using the use case
    const userProgress = await courseProgressUseCase.getCourseProgressByCourseId(courseId);
    const userProgressMap = new Map();
    
    userProgress
      .filter(progress => progress.getDataValue('userId') === userId)
      .forEach(progress => {
        const lessonId = progress.getDataValue('lessonId');
        if (lessonId) {
          userProgressMap.set(lessonId, progress);
        }
      });

    // Transform modules using mapper and add computed fields
    const transformedModules = modules.map(module => {
      const moduleDto = moduleMapper.toDTO(module);
      const moduleData = module.toJSON();
      
      // Calculate completion status and progress for lessons
      const lessons = moduleData.lessons || [];
      const lessonsWithProgress = lessons.map((lesson: any) => {
        const progress = userProgressMap.get(lesson.id);
        const isCompleted = progress ? progress.getDataValue('status') === 'completed' : false;
        
        return {
          ...lesson,
          // Transform JSON fields safely
          objectives: lesson.objectives ? (
            typeof lesson.objectives === 'string' ? JSON.parse(lesson.objectives) : lesson.objectives
          ) : [],
          prerequisites: lesson.prerequisites ? (
            typeof lesson.prerequisites === 'string' ? JSON.parse(lesson.prerequisites) : lesson.prerequisites
          ) : [],
          keywords: lesson.keywords ? (
            typeof lesson.keywords === 'string' ? JSON.parse(lesson.keywords) : lesson.keywords
          ) : [],
          reviews: lesson.reviews ? (
            typeof lesson.reviews === 'string' ? JSON.parse(lesson.reviews) : lesson.reviews
          ) : [],
          // Add computed fields
          isCompleted,
          progress: progress ? progress.getDataValue('completionPercentage') : 0,
          assignments: lesson.assignments || [],
          quizzes: lesson.quizzes || [],
          resources: [] // Add resources if needed
        };
      });

      const completedLessons = lessonsWithProgress.filter((lesson: any) => lesson.isCompleted).length;
      const totalLessons = lessonsWithProgress.length;
      
      return {
        ...moduleDto,
        completedLessons,
        totalLessons,
        isCompleted: completedLessons === totalLessons && totalLessons > 0,
        progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        lessons: lessonsWithProgress
      };
    });

    return NextResponse.json(
      {
        data: transformedModules,
        message: "Course modules retrieved successfully",
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
        message: error.message || "Failed to fetch course modules",
        success: false,
        validationErrors: [],
      },
      { status: 500 }
    );
  }
}
