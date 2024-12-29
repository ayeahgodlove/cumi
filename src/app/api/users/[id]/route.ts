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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const dto = new UserRequestDto(await req.json());
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
      const id = params.id;

      const obj: IUser = {
        ...emptyUser,
        ...req.body,
        id: id,
      };
      const updatedUser = await userUseCase.updateUser(obj);
      const userDto = userMapper.toDTO(updatedUser);

      return NextResponse.json(
        {
          data: userDto,
          message: "User Updated Successfully!",
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

    const user = await userUseCase.getUserById(id);
    if (!user) {
      throw new NotFoundException("User", id);
    }
    const userDTO = userMapper.toDTO(user);
    return NextResponse.json(userDTO);
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

    await userUseCase.deleteUser(id);

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
