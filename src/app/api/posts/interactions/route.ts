import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { PostInteractionUseCase } from "@domain/usecases/post-interaction.usecase";
import { PostInteractionRepository } from "@data/repositories/impl/post-interaction.repository";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          data: null,
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { postId, action } = body;

    if (!postId || !action) {
      return NextResponse.json(
        {
          success: false,
          message: "Post ID and action are required",
          data: null,
        },
        { status: 400 }
      );
    }

    if (!['like', 'dislike'].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid action. Must be 'like' or 'dislike'",
          data: null,
        },
        { status: 400 }
      );
    }

    const postInteractionRepository = new PostInteractionRepository();
    const postInteractionUseCase = new PostInteractionUseCase(postInteractionRepository);

    const result = await postInteractionUseCase.handleInteraction(postId, action, session.user.id);

    return NextResponse.json({
      success: true,
      message: "Interaction updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error handling post interaction:", error);
    
    if (error.message && error.message.includes("doesn't exist")) {
      return NextResponse.json(
        {
          success: false,
          message: "Post interactions feature is not available yet. Please try again later.",
          data: null,
        },
        { status: 503 }
      );
    }

    if (error.message && error.message.includes("already")) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          data: null,
          isDuplicate: true,
        },
        { status: 409 } // Conflict status for duplicate action
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update interaction",
        data: null,
      },
      { status: 400 }
    );
  }
}
