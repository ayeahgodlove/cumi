import Role from "@data/entities/role";
import { RoleRepository } from "@data/repositories/impl/role.repository";
import { RoleUseCase } from "@domain/usecases/role.usecase";
import { RoleRequestDto } from "@presentation/dtos/role-request.dto";
import { RoleMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { NextRequest, NextResponse } from "next/server";

const roleRepository = new RoleRepository();
const roleUseCase = new RoleUseCase(roleRepository);
const roleMapper = new RoleMapper();

export async function GET(request: any) {
  try {
    const categories = await Role.findAll();

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
  const dto = new RoleRequestDto(body);
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
    const roleResponse = await roleUseCase.createRole(dto.toData());
    return NextResponse.json(
      {
        data: roleResponse.toJSON(),
        message: "role created Successfully!",
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
