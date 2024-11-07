import { ServiceRepository } from "@data/repositories/impl/service.repository";
import { ServiceUseCase } from "@domain/usecases/service.usecase";
import { ServiceMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { NextResponse, NextRequest } from "next/server";

const serviceRepository = new ServiceRepository();
const serviceUseCase = new ServiceUseCase(serviceRepository);
const serviceMapper = new ServiceMapper();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    const service = await serviceUseCase.getServiceBySlug(slug);
    if (!service) {
      throw new NotFoundException("Service", slug);
    }
    const serviceDTO = serviceMapper.toDTO(service);
    return NextResponse.json(serviceDTO);
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
