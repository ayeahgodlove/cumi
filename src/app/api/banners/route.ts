import { BannerRepository } from "@data/repositories/impl/banner.repository";
import { BannerUseCase } from "@domain/usecases/banner.usecase";
import authOptions from "@lib/options";
import { BannerRequestDto } from "@presentation/dtos/banner-request.dto";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const bannerRepository = new BannerRepository();
const bannerUseCase = new BannerUseCase(bannerRepository);

export async function GET(request: any) {
  try {
    const categories = await bannerUseCase.getAll();

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
