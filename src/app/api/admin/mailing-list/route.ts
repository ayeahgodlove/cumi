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

    // Check if user is admin
    const currentUser = await userUseCase.getUserByEmail(session.user.email!);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { subject, html, text, recipientType, recipientIds } = await request.json();

    if (!subject || !html || !text) {
      return NextResponse.json(
        { error: "Subject, HTML, and text content are required" },
        { status: 400 }
      );
    }

    let recipients = [];

    if (recipientType === 'all') {
      // Get all users
      const allUsers = await userUseCase.getAll();
      recipients = allUsers.map(user => ({
        email: user.email,
        name: user.fullName || user.username
      }));
    } else if (recipientType === 'specific' && recipientIds && recipientIds.length > 0) {
      // Get specific users
      for (const userId of recipientIds) {
        const user = await userUseCase.getUserById(userId);
        if (user) {
          recipients.push({
            email: user.email,
            name: user.fullName || user.username
          });
        }
      }
    } else {
      return NextResponse.json(
        { error: "Invalid recipient selection" },
        { status: 400 }
      );
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No recipients found" },
        { status: 400 }
      );
    }

    // Send bulk email
    const results = await emailService.sendBulkEmail(recipients, subject, html, text);

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      message: `Email campaign sent successfully`,
      totalRecipients: recipients.length,
      successCount,
      failureCount,
      results
    });

  } catch (error) {
    console.error("Error sending bulk email:", error);
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

    // Check if user is admin
    const currentUser = await userUseCase.getUserByEmail(session.user.email!);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get all users for mailing list
    const users = await userUseCase.getAll();
    const mailingList = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.fullName || user.username,
      role: user.role,
      accountStatus: user.accountStatus,
      createdAt: user.createdAt
    }));

    return NextResponse.json({
      mailingList,
      totalUsers: mailingList.length
    });

  } catch (error) {
    console.error("Error fetching mailing list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
