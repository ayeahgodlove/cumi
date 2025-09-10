import { CourseEnrollmentRepository } from "@data/repositories/impl/course-enrollment.repository";
import { CourseEnrollmentUseCase } from "@domain/usecases/course-enrollment.usecase";
import authOptions from "@lib/options";
import { CourseEnrollmentRequestDto } from "@presentation/dtos/course-enrollment-request.dto";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const courseEnrollmentRepository = new CourseEnrollmentRepository();
const courseEnrollmentUseCase = new CourseEnrollmentUseCase(courseEnrollmentRepository);

export async function GET(request: any) {
  try {
    const enrollments = await courseEnrollmentUseCase.getAll();
    return NextResponse.json(enrollments);
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
    const dto = new CourseEnrollmentRequestDto(body);
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

    const enrollmentResponse = await courseEnrollmentUseCase.createEnrollment({
      ...dto.toData(),
      userId,
    });

    return NextResponse.json(
      {
        data: enrollmentResponse.toJSON(),
        message: "Enrollment created successfully!",
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