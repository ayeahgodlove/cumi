import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@services/email.service";
import { userUseCase } from "@domain/usecases/user.usecase";
import authOptions from "@lib/options";
import { getServerSession } from "next-auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { 
      userId, 
      title, 
      message, 
      actionUrl, 
      type = 'general' 
    } = await request.json();

    if (!userId || !title || !message) {
      return NextResponse.json(
        { error: "User ID, title, and message are required" },
        { status: 400 }
      );
    }

    // Get user details
    const user = await userUseCase.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has email notifications enabled
    if (!user.emailNotifications) {
      return NextResponse.json(
        { message: "User has email notifications disabled" },
        { status: 200 }
      );
    }

    // Send notification email
    await emailService.sendNotificationEmail(
      user.email,
      user.fullName || user.username,
      title,
      message,
      actionUrl
    );

    return NextResponse.json({
      message: "Notification email sent successfully"
    });

  } catch (error) {
    console.error("Error sending notification email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get current user
    const currentUser = await userUseCase.getUserByEmail(session.user.email!);
    if (!currentUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      emailNotifications: currentUser.emailNotifications,
      smsNotifications: currentUser.smsNotifications
    });

  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
