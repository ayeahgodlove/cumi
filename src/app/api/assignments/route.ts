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
import { courseUseCase } from "@domain/usecases/course.usecase";

const assignmentRepository = new AssignmentRepository();
const assignmentUseCase = new AssignmentUseCase(assignmentRepository);
const assignmentMapper = new AssignmentMapper();

export async function GET(request: any) {
  try {
    const assignments = await assignmentUseCase.getAll();
    const assignmentsDto = assignmentMapper.toDTOs(assignments);
    return NextResponse.json(assignmentsDto);
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
      const course = await courseUseCase.getCourseById(assignmentData.courseId);
      
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
