import { EnrollmentRepository } from "@data/repositories/impl/enrollment.repository";
import { emptyEnrollment, IEnrollment } from "@domain/models/enrollment";
import { EnrollmentUseCase } from "@domain/usecases/enrollment.usecase";
import authOptions from "@lib/options";
import { EnrollmentRequestDto } from "@presentation/dtos/enrollment-request.dto";
import { EnrollmentMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

const enrollmentRepository = new EnrollmentRepository();
const enrollmentUseCase = new EnrollmentUseCase(enrollmentRepository);
const enrollmentMapper = new EnrollmentMapper();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions); //get session info

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
    const dto = new EnrollmentRequestDto(await req.json());
    const validationErrors = await validate(dto);
    const userId = session.user.id;

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
    }

    const id = params.id;
    const obj: IEnrollment = {
      ...emptyEnrollment,
      ...dto.toData(),
      id: id,
      userId,
    };
    const updatedEnrollment = await enrollmentUseCase.updateEnrollment(obj);
    const enrollmentDto = enrollmentMapper.toDTO(updatedEnrollment);

    return NextResponse.json(
      {
        data: enrollmentDto,
        message: "Enrollment Updated Successfully!",
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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const enrollment = await enrollmentUseCase.getEnrollmentById(id);
    if (!enrollment) {
      throw new NotFoundException("Enrollment", id);
    }
    const enrollmentDTO = enrollmentMapper.toDTO(enrollment);
    return NextResponse.json(enrollmentDTO);
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

    await enrollmentUseCase.deleteEnrollment(id);

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
