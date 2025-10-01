import { NextRequest, NextResponse } from "next/server";
import { UserUseCase } from "@domain/usecases/user.usecase";
import { UserRepository } from "@data/repositories/impl/user.repository";
import bcrypt from "bcrypt";

const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Find user by reset token
    const user = await userUseCase.getUserByResetToken(token) as any;
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
      return NextResponse.json(
        { error: "Reset token has expired" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password and clear reset token
    await userUseCase.updateUser({
      ...user,
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
      lastPasswordChange: new Date()
    } as any);

    return NextResponse.json(
      { message: "Password has been reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in password reset:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
