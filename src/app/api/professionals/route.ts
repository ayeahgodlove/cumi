import { ProfessionalRepository } from "@data/repositories/impl/professional.repository";
import { ProfessionalUseCase } from "@domain/usecases/professional.usecase";
import authOptions from "@lib/options";
import { ProfessionalRequestDto } from "@presentation/dtos/professional-request.dto";
import { ProfessionalMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const professionalRepository = new ProfessionalRepository();
const professionalUseCase = new ProfessionalUseCase(professionalRepository);
const professionalMapper = new ProfessionalMapper();

export async function GET(request: any) {
  try {
    const professionals = await professionalUseCase.getVerifiedProfessionals();
    const professionalsMapped = professionalMapper.toDTOs(professionals as any);
    
    return NextResponse.json(professionalsMapped);
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
    const professional = await professionalUseCase.create(professionalData);
    const professionalDTO = professionalMapper.toDTO(professional as any);

    return NextResponse.json(
      {
        data: professionalDTO,
        message: "Professional profile created successfully",
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
        validationErrors: [error],
        success: false,
      },
      { status: 400 }
    );
  }
}
