import { AssignmentRepository } from "@data/repositories/impl/assignment.repository";
import { AssignmentUseCase } from "@domain/usecases/assignment.usecase";
import authOptions from "@lib/options";
import { AssignmentRequestDto } from "@presentation/dtos/assignment-request.dto";
import { AssignmentMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { notificationService } from "@services/notification.service";
import { CourseUseCase } from "@domain/usecases/course.usecase";
import { CourseRepository } from "@data/repositories/impl/course.repository";

const assignmentRepository = new AssignmentRepository();
const assignmentUseCase = new AssignmentUseCase(assignmentRepository);
const assignmentMapper = new AssignmentMapper();
const courseRepository = new CourseRepository();
const courseUseCase = new CourseUseCase(courseRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const courseId = searchParams.get('courseId');
    const lessonId = searchParams.get('lessonId');

    console.log("Assignments API called with params:", { moduleId, courseId, lessonId });

    let assignments;
    if (lessonId) {
      console.log("Fetching assignments for lessonId:", lessonId);
      assignments = await assignmentUseCase.getAssignmentsByLessonId(lessonId);
      console.log("Found assignments for lesson:", assignments.length);
    } else if (moduleId) {
      console.log("Fetching assignments for moduleId:", moduleId);
      assignments = await assignmentUseCase.getAssignmentsByModuleId(moduleId);
      console.log("Found assignments for module:", assignments.length);
    } else if (courseId) {
      console.log("Fetching assignments for courseId:", courseId);
      assignments = await assignmentUseCase.getAssignmentsByCourseId(courseId);
      console.log("Found assignments for course:", assignments.length);
    } else {
      console.log("Fetching all assignments");
      assignments = await assignmentUseCase.getAll();
      console.log("Found total assignments:", assignments.length);
    }
    
    const assignmentsDto = assignmentMapper.toDTOs(assignments);
    console.log("Mapped assignments DTOs:", assignmentsDto.length);
    
    return NextResponse.json({
      data: assignmentsDto,
      message: "Assignments retrieved successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Error in assignments API:", error);
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
    const dto = new AssignmentRequestDto(body);
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

    const assignmentResponse = await assignmentUseCase.createAssignment({
      ...dto.toData(),
      userId,
    });

    // Send assignment submission notification email
    try {
      const assignmentData = dto.toData();
      const course = await courseUseCase.getCourseById(assignmentData.courseId) as any;
      
      if (course) {
        await notificationService.notifyAssignmentSubmission(
          userId,
          assignmentData.title || 'Assignment',
          course.title
        );
      }
    } catch (emailError) {
      console.error("Failed to send assignment notification:", emailError);
      // Don't fail the assignment submission if email fails
    }

    return NextResponse.json(
      {
        data: assignmentResponse.toJSON(),
        message: "Assignment created Successfully!",
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
