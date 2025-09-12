import { NextRequest, NextResponse } from "next/server";
import { CommentInteractionUseCase } from "@domain/usecases/comment-interaction.usecase";
import { CommentInteractionRepository } from "@data/repositories/impl/comment-interaction.repository";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
          data: null,
        },
        { status: 400 }
      );
    }

    const commentInteractionRepository = new CommentInteractionRepository();
    const commentInteractionUseCase = new CommentInteractionUseCase(commentInteractionRepository);

    const interactions = await commentInteractionUseCase.getUserInteractions(userId);

    return NextResponse.json({
      success: true,
      message: "User comment interactions retrieved successfully",
      data: interactions,
    });
  } catch (error: any) {
    console.error("Error fetching user comment interactions:", error);
    
    if (error.message && error.message.includes("doesn't exist")) {
      return NextResponse.json(
        {
          success: true,
          message: "Comment interactions feature coming soon",
          data: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch user comment interactions",
        data: null,
      },
      { status: 400 }
    );
  }
}
