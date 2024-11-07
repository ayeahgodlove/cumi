import Tag from "@data/entities/tag";
import { TagRepository } from "@data/repositories/impl/tag.repository";
import { TagUseCase } from "@domain/usecases/tag.usecase";
import { TagRequestDto } from "@presentation/dtos/tag-request.dto";
import { TagMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { NextRequest, NextResponse } from "next/server";

const tagRepository = new TagRepository();
const tagUseCase = new TagUseCase(tagRepository);
const tagMapper = new TagMapper();

export async function GET(request: any) {
  try {
    const categories = await Tag.findAll();

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
  const dto = new TagRequestDto(body);
  const validationErrors = await validate(dto);

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
    const tagResponse = await tagUseCase.createTag(dto.toData());
    return NextResponse.json(
      {
        data: tagResponse.toJSON(),
        message: "tag created Successfully!",
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
