import { NextRequest, NextResponse } from "next/server";
import { PostInteractionUseCase } from "@domain/usecases/post-interaction.usecase";
import { PostInteractionRepository } from "@data/repositories/impl/post-interaction.repository";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const userId = searchParams.get("userId");

    if (!postId) {
      return NextResponse.json(
        {
          success: false,
          message: "Post ID is required",
          data: null,
        },
        { status: 400 }
      );
    }

    const postInteractionRepository = new PostInteractionRepository();
    const postInteractionUseCase = new PostInteractionUseCase(postInteractionRepository);

    const stats = await postInteractionUseCase.getPostStats(postId, userId || undefined);

    return NextResponse.json({
      success: true,
      message: "Post stats retrieved successfully",
      data: stats,
    });
  } catch (error: any) {
    console.error("Error fetching post stats:", error);
    
    if (error.message && error.message.includes("doesn't exist")) {
      return NextResponse.json(
        {
          success: true,
          message: "Post interactions feature coming soon",
          data: {
            postId: "",
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
        message: error.message || "Failed to fetch post stats",
        data: null,
      },
      { status: 400 }
    );
  }
}


