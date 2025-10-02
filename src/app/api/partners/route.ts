import { PartnerRepository } from "@data/repositories/impl/partner.repository";
import { PartnerUseCase } from "@domain/usecases/partner.usecase";
import authOptions from "@lib/options";
import { PartnerRequestDto } from "@presentation/dtos/partner-request.dto";
import { PartnerMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const partnerRepository = new PartnerRepository();
const partnerUseCase = new PartnerUseCase(partnerRepository);
const partnerMapper = new PartnerMapper();

export async function GET(request: any) {
  try {
    // Make this endpoint public - partners should be viewable by anyone
    const partners = await partnerUseCase.getAll();
    
    return NextResponse.json(partners);
  } catch (error: any) {
    return NextResponse.json(
      {
        data: [],
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
    const partnerRequestDto = new PartnerRequestDto(body);
    const validationErrors = await validate(partnerRequestDto);

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

    const partnerData = partnerRequestDto.toData();
    const partner = await partnerUseCase.create(partnerData);

    return NextResponse.json(
      {
        data: partner,
        message: "Partner created successfully",
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
