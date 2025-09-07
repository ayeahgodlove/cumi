import { ProfessionalRepository } from "@data/repositories/impl/professional.repository";
import { ProfessionalUseCase } from "@domain/usecases/professional.usecase";
import { ProfessionalMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { NextResponse, NextRequest } from "next/server";

const professionalRepository = new ProfessionalRepository();
const professionalUseCase = new ProfessionalUseCase(professionalRepository);
const professionalMapper = new ProfessionalMapper();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const professional = await professionalUseCase.getById(id);
    if (!professional) {
      throw new NotFoundException("Professional", id);
    }
    const professionalDTO = professionalMapper.toDTO(professional as any);
    return NextResponse.json(professionalDTO);
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
