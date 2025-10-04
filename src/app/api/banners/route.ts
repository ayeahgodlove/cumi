import { BannerRepository } from "@data/repositories/impl/banner.repository";
import { BannerUseCase } from "@domain/usecases/banner.usecase";
import authOptions from "@lib/options";
import { BannerRequestDto } from "@presentation/dtos/banner-request.dto";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const bannerRepository = new BannerRepository();
const bannerUseCase = new BannerUseCase(bannerRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const banners = await bannerUseCase.getAll();

    // Apply pagination if needed
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBanners = banners.slice(startIndex, endIndex);

    return NextResponse.json(paginatedBanners);
  } catch (error: any) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      {
        data: [],
        message: "Banners feature coming soon",
        validationErrors: [],
        success: true,
      },
      { status: 200 }
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
    const dto = new BannerRequestDto(body);
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

    const bannerResponse = await bannerUseCase.createBanner({
      ...dto.toData(),
      userId,
    });
    return NextResponse.json(
      {
        data: bannerResponse.toJSON(),
        message: "banner created Successfully!",
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


