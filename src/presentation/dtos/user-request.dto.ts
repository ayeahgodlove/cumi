// src/presentation/dtos/user-request.dto.ts

import { emptyUser, IUser } from "@domain/models/user";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { nanoid } from "nanoid";
export class UserRequestDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 25)
  username: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  password: string;

  constructor(data: IUser) {
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.fullname = data.fullname;
  }

  toData(): IUser {
    return {
      ...emptyUser,
      id: nanoid(10),
      username: this.username,
      email: this.email,
      password: this.password,
      fullname: this.fullname,
    };
  }

  toUpdateData(data: IUser): IUser {
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      password: data.password,
      address: data.address,
      authStrategy: data.authStrategy,
      roles: data.roles,
      verified: data.verified,
      fullname: data.fullname,
    };
  }
}
