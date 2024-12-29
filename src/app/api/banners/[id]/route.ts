import Banner from "@data/entities/banner";
import { BannerRepository } from "@data/repositories/impl/banner.repository";
import { emptyBanner, IBanner } from "@domain/models/banner.model";
import { BannerUseCase } from "@domain/usecases/banner.usecase";
import { BannerRequestDto } from "@presentation/dtos/banner-request.dto";
import { BannerMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { NextResponse, NextRequest } from "next/server";

const bannerRepository = new BannerRepository();
const bannerUseCase = new BannerUseCase(bannerRepository);
const bannerMapper = new BannerMapper();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const dto = new BannerRequestDto(await req.json());
  const validationErrors = await validate(dto);
  const userId = req.headers.get("X-User-Id") || "";

  if (validationErrors.length > 0) {
    return NextResponse.json(
      {
        validationErrors: displayValidationErrors(validationErrors) as any,
        success: false,
        data: null,
        message: "Attention!",
      },
      { status: 400 }
    );
  } else {
    try {
      const id = params.id;
      const obj: IBanner = {
        ...emptyBanner,
        ...dto.toData(),
        id: id,
        userId,
      };
      const updatedBanner = await bannerUseCase.updateBanner(obj);
      const bannerDto = bannerMapper.toDTO(updatedBanner);

      return NextResponse.json(
        {
          data: bannerDto,
          message: "Banner Updated Successfully!",
          validationErrors: [],
          success: true,
        },
        { status: 200 }
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
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const banner = await bannerUseCase.getBannerById(id);
    if (!banner) {
      throw new NotFoundException("Banner", id);
    }
    const bannerDTO = bannerMapper.toDTO(banner);
    return NextResponse.json(bannerDTO);
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    await bannerUseCase.deleteBanner(id);

    return NextResponse.json({
      message: `Operation successfully completed!`,
      validationErrors: [],
      success: true,
      data: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
        data: null,
        validationErrors: [error],
        success: true,
      },
      { status: 400 }
    );
  }
}
