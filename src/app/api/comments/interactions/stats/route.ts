import { NextRequest, NextResponse } from "next/server";
import { CommentInteractionUseCase } from "@domain/usecases/comment-interaction.usecase";
import { CommentInteractionRepository } from "@data/repositories/impl/comment-interaction.repository";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");
    const userId = searchParams.get("userId");

    if (!commentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Comment ID is required",
          data: null,
        },
        { status: 400 }
      );
    }

    const commentInteractionRepository = new CommentInteractionRepository();
    const commentInteractionUseCase = new CommentInteractionUseCase(commentInteractionRepository);

    const stats = await commentInteractionUseCase.getCommentStats(commentId, userId || undefined);

    return NextResponse.json({
      success: true,
      message: "Comment stats retrieved successfully",
      data: stats,
    });
  } catch (error: any) {
    console.error("Error fetching comment stats:", error);
    
    if (error.message && error.message.includes("doesn't exist")) {
      return NextResponse.json(
        {
          success: true,
          message: "Comment interactions feature coming soon",
          data: {
            commentId: "",
            likesCount: 0,
            dislikesCount: 0,
            userInteraction: null,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch comment stats",
        data: null,
      },
      { status: 400 }
    );
  }
}
