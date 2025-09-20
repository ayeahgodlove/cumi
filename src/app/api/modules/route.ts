import { ModuleRepository } from "@data/repositories/impl/module.repository";
import { ModuleUseCase } from "@domain/usecases/module.usecase";
import authOptions from "@lib/options";
import { ModuleRequestDto } from "@presentation/dtos/module-request.dto";
import { ModuleMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const moduleRepository = new ModuleRepository();
const moduleUseCase = new ModuleUseCase(moduleRepository);
const moduleMapper = new ModuleMapper();

export async function GET(request: any) {
  try {
    const modules = await moduleUseCase.getAll();
    const modulesDto = moduleMapper.toDTOs(modules);
    return NextResponse.json(modulesDto);
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
  const session = await getServerSession(authOptions);

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
    const dto = new ModuleRequestDto(body);
    const validationErrors = await validate(dto);
    const userId = session.user.id;

    console.log("results: ", validationErrors, body, dto.toData());
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

    const moduleResponse = await moduleUseCase.createModule({
      ...dto.toData(),
      userId,
    });
    return NextResponse.json(
      {
        data: moduleResponse.toJSON(),
        message: "Module created Successfully!",
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
