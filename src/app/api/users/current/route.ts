import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import authOptions from "@lib/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Please log in to access this resource.",
          data: null,
        },
        { status: 401 }
      );
    }

    // Return current user data
    return NextResponse.json({
      success: true,
      message: "Current user retrieved successfully",
      data: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        fullName: session.user.fullName,
        image: session.user.image,
        role: session.user.role,
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get current user",
        data: null,
      },
      { status: 500 }
    );
  }
}
