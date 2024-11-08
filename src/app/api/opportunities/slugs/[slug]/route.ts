import { OpportunityRepository } from "@data/repositories/impl/opportunity.repository";
import { OpportunityUseCase } from "@domain/usecases/opportunity.usecase";
import { OpportunityMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { NextResponse, NextRequest } from "next/server";

const opportunityRepository = new OpportunityRepository();
const opportunityUseCase = new OpportunityUseCase(opportunityRepository);
const opportunityMapper = new OpportunityMapper();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    const opportunity = await opportunityUseCase.getOpportunityBySlug(slug);
    if (!opportunity) {
      throw new NotFoundException("Opportunity", slug);
    }
    const opportunityDTO = opportunityMapper.toDTO(opportunity);
    return NextResponse.json(opportunityDTO);
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
