import { IsNotEmpty, IsString, MinLength, validate } from "class-validator";
export class PasswordValidator {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;
}

export const validatePassword = async (password: string): Promise<boolean> => {
  const passwordValidator = new PasswordValidator();
  passwordValidator.password = password;
  const errors = await validate(passwordValidator);
  if (errors.length > 0) {
    return false;
  } else {
    return true;
  }
};
