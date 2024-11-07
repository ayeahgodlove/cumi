import Category from "@data/entities/category";
import { CategoryRepository } from "@data/repositories/impl/category.repository";
import { CategoryUseCase } from "@domain/usecases/category.usecase";
import { CategoryRequestDto } from "@presentation/dtos/category-request.dto";
import { CategoryMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { NextRequest, NextResponse } from "next/server";

const categoryRepository = new CategoryRepository();
const categoryUseCase = new CategoryUseCase(categoryRepository);
const categoryMapper = new CategoryMapper();

export async function GET(request: any) {
  try {
    const categories = await Category.findAll();

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
  const dto = new CategoryRequestDto(body);
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
    const categoryResponse = await categoryUseCase.createCategory(dto.toData());
    return NextResponse.json(
      {
        data: categoryResponse.toJSON(),
        message: "category created Successfully!",
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
