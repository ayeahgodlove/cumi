import Enrollment from "@data/entities/enrollment";
import { EnrollmentRepository } from "@data/repositories/impl/enrollment.repository";
import { EnrollmentUseCase } from "@domain/usecases/enrollment.usecase";
import { EnrollmentRequestDto } from "@presentation/dtos/enrollment-request.dto";
import { EnrollmentMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { NextRequest, NextResponse } from "next/server";

const enrollmentRepository = new EnrollmentRepository();
const enrollmentUseCase = new EnrollmentUseCase(enrollmentRepository);
const enrollmentMapper = new EnrollmentMapper();

export async function GET(request: any) {
  try {
    const categories = await Enrollment.findAll();

    return NextResponse.json(categories);
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
  const body = await request.json();
  const dto = new EnrollmentRequestDto(body);
  const validationErrors = await validate(dto);
  const userId = request.headers.get("X-User-Id") || "";

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

  try {
    const enrollmentResponse = await enrollmentUseCase.createEnrollment({
      ...dto.toData(),
    });
    return NextResponse.json(
      {
        data: enrollmentResponse.toJSON(),
        message: "enrollment created Successfully!",
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
