import { NextRequest, NextResponse } from "next/server";
import { userUseCase } from "@domain/usecases/user.usecase";
import { emailService } from "@services/email.service";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await userUseCase.getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { message: "If the email exists, a password reset link has been sent" },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user with reset token
    await userUseCase.updateUser({
      ...user,
      resetToken,
      resetTokenExpiry
    });

    // Send password reset email
    await emailService.sendPasswordResetEmail(
      user.email,
      user.fullName || user.username,
      resetToken
    );

    return NextResponse.json(
      { message: "If the email exists, a password reset link has been sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in password reset request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
