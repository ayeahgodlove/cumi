import User from "@data/entities/user";
import { UserRepository } from "@data/repositories/impl/user.repository";
import { emptyUser, IUser } from "@domain/models/user";
import { UserUseCase } from "@domain/usecases/user.usecase";
import { UserRequestDto } from "@presentation/dtos/user-request.dto";
import { UserMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { NextResponse, NextRequest } from "next/server";

const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);
const userMapper = new UserMapper();

export async function GET(request: NextRequest) {
  try {
    const users = await User.findAll({ order: [["createdAt", "DESC"]] });

    return NextResponse.json(users);
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
  const dto = new UserRequestDto(body);
  const validationErrors = await validate(dto);


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
      const userResponse = await userUseCase.createUser(dto.toData());

      return NextResponse.json(
        {
          data: userMapper.toDTO(userResponse),
          message: "User created Successfully!",
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
}