import { ServiceRepository } from "@data/repositories/impl/service.repository";
import { ServiceUseCase } from "@domain/usecases/service.usecase";
import authOptions from "@lib/options";
import { ServiceRequestDto } from "@presentation/dtos/service-request.dto";
import { ServiceMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const serviceRepository = new ServiceRepository();
const serviceUseCase = new ServiceUseCase(serviceRepository);
const serviceMapper = new ServiceMapper();
export async function GET(request: any) {
  try {
    const services = await serviceRepository.getAll();
    const servicesMapped = serviceMapper.toDTOs(services);
    
    return NextResponse.json(servicesMapped);
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
    const body = await request.json();
    const dto = new ServiceRequestDto(body);
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

    const serviceResponse = await serviceUseCase.createService({
      ...dto.toData(),
      userId,
    });
    return NextResponse.json(
      {
        data: serviceResponse.toJSON(),
        message: "service created Successfully!",
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
