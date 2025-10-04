import { CategoryRepository } from "@data/repositories/impl/category.repository";
import { CategoryUseCase } from "@domain/usecases/category.usecase";
import authOptions from "@lib/options";
import { CategoryRequestDto } from "@presentation/dtos/category-request.dto";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const categoryRepository = new CategoryRepository();
const categoryUseCase = new CategoryUseCase(categoryRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const categories = await categoryUseCase.getAll();

    // Apply pagination if needed
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCategories = categories.slice(startIndex, endIndex);

    return NextResponse.json(paginatedCategories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        data: [],
        message: "Categories feature coming soon",
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


