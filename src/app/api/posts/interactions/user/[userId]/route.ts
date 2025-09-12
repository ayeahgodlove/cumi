import { NextRequest, NextResponse } from "next/server";
import { PostInteractionUseCase } from "@domain/usecases/post-interaction.usecase";
import { PostInteractionRepository } from "@data/repositories/impl/post-interaction.repository";

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

    const postInteractionRepository = new PostInteractionRepository();
    const postInteractionUseCase = new PostInteractionUseCase(postInteractionRepository);

    const interactions = await postInteractionUseCase.getUserInteractions(userId);

    return NextResponse.json({
      success: true,
      message: "User post interactions retrieved successfully",
      data: interactions,
    });
  } catch (error: any) {
    console.error("Error fetching user post interactions:", error);
    
    if (error.message && error.message.includes("doesn't exist")) {
      return NextResponse.json(
        {
          success: true,
          message: "Post interactions feature coming soon",
          data: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch user post interactions",
        data: null,
      },
      { status: 400 }
    );
  }
}
