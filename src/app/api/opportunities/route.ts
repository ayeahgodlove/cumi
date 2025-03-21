import { OpportunityRepository } from "@data/repositories/impl/opportunity.repository";
import { OpportunityUseCase } from "@domain/usecases/opportunity.usecase";
import authOptions from "@lib/options";
import { OpportunityRequestDto } from "@presentation/dtos/opportunity-request.dto";
import { OpportunityMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const opportunityRepository = new OpportunityRepository();
const opportunityUseCase = new OpportunityUseCase(opportunityRepository);
const opportunityMapper = new OpportunityMapper();

export async function GET(request: any) {
  try {
    const opportunitys = await opportunityUseCase.getAll();
    const opportunitysDto = opportunityMapper.toDTOs(opportunitys);
    return NextResponse.json(opportunitysDto);
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
    const dto = new OpportunityRequestDto({ ...body, isActive: false });
    const validationErrors = await validate(dto);
  
    // Begin transaction if needed
  
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

    const opportunityResponse = await opportunityUseCase.createOpportunity({
      ...dto.toData(),
    });

    return NextResponse.json(
      {
        data: opportunityResponse.toJSON(),
        message: "opportunity created Successfully!",
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
