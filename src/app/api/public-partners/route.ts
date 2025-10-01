import { PartnerRepository } from "@data/repositories/impl/partner.repository";
import { PartnerUseCase } from "@domain/usecases/partner.usecase";
import { NextResponse } from "next/server";

const partnerRepository = new PartnerRepository();
const partnerUseCase = new PartnerUseCase(partnerRepository);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const partners = await partnerUseCase.getAll();
    
    return NextResponse.json({
      data: partners,
      message: "Partners fetched successfully",
      validationErrors: [],
      success: true,
    });
  } catch (error: any) {
    console.error("Error fetching public partners:", error);
    return NextResponse.json(
      {
        data: [],
        message: error.message || "Failed to fetch partners",
        validationErrors: [],
        success: false,
      },
      { status: 200 } // Return 200 with empty array to avoid breaking UI
    );
  }
}

