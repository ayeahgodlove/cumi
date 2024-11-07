import Banner from "@data/entities/banner";
import { BannerRepository } from "@data/repositories/impl/banner.repository";
import { BannerUseCase } from "@domain/usecases/banner.usecase";
import { BannerRequestDto } from "@presentation/dtos/banner-request.dto";
import { BannerMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { NextRequest, NextResponse } from "next/server";

const bannerRepository = new BannerRepository();
const bannerUseCase = new BannerUseCase(bannerRepository);
const bannerMapper = new BannerMapper();

export async function GET(request: any) {
  try {
    const categories = await Banner.findAll();

    return NextResponse.json(categories);
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
  const body = await request.json();
  const dto = new BannerRequestDto(body);
  const validationErrors = await validate(dto);

  const userId = request.headers.get("X-User-Id") || "";

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

  try {
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
