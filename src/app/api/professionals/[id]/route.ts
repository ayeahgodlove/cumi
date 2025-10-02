import { ProfessionalRepository } from "@data/repositories/impl/professional.repository";
import { ProfessionalUseCase } from "@domain/usecases/professional.usecase";
import authOptions from "@lib/options";
import { ProfessionalRequestDto } from "@presentation/dtos/professional-request.dto";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const professionalRepository = new ProfessionalRepository();
const professionalUseCase = new ProfessionalUseCase(professionalRepository);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Make this endpoint public - professional profiles should be viewable by anyone
    const { id } = params;
    const professional = await professionalUseCase.getById(id);

    if (!professional) {
      return NextResponse.json(
        {
          data: null,
          message: "Professional not found",
          validationErrors: [],
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(professional);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        data: null,
        message: "Unauthorized",
        validationErrors: [],
        success: false,
      },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    const body = await request.json();
    const professionalRequestDto = new ProfessionalRequestDto(body);
    const validationErrors = await validate(professionalRequestDto);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          data: null,
          message: "Validation failed",
          validationErrors: displayValidationErrors(validationErrors),
          success: false,
        },
        { status: 400 }
      );
    }

    const professionalData = professionalRequestDto.toData();
    const professional = await professionalUseCase.update(id, professionalData);

    if (!professional) {
      return NextResponse.json(
        {
          data: null,
          message: "Professional not found",
          validationErrors: [],
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: professional,
        message: "Professional updated successfully",
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        data: null,
        message: "Unauthorized",
        validationErrors: [],
        success: false,
      },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    const deleted = await professionalUseCase.delete(id);

    if (!deleted) {
      return NextResponse.json(
        {
          data: null,
          message: "Professional not found",
          validationErrors: [],
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: null,
        message: "Professional deleted successfully",
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