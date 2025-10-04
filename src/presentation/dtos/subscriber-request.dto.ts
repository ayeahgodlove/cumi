import { IsEmail, IsNotEmpty, IsOptional, IsBoolean } from "class-validator";

export class SubscriberRequestDto {
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class SubscriberResponseDto {
  id!: number;
  email!: string;
  name?: string;
  isActive!: boolean;
  subscribedAt!: Date;
  createdAt!: Date;
  updatedAt!: Date;
}

