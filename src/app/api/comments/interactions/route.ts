import { CommentInteractionRepository } from "@data/repositories/impl/comment-interaction.repository";
import { CommentInteractionUseCase } from "@domain/usecases/comment-interaction.usecase";
import authOptions from "@lib/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const commentInteractionRepository = new CommentInteractionRepository();
const commentInteractionUseCase = new CommentInteractionUseCase(commentInteractionRepository);

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Unauthorized: Please log in to interact with comments.",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { commentId, action } = body;
    const userId = session.user.id;

    if (!commentId || !action) {
      return NextResponse.json(
        {
          message: "Comment ID and action are required",
          success: false,
          data: null,
          validationErrors: [],
        },
        { status: 400 }
      );
    }

    if (!['like', 'dislike'].includes(action)) {
      return NextResponse.json(
        {
          message: "Action must be 'like' or 'dislike'",
          success: false,
          data: null,
          validationErrors: [],
        },
        { status: 400 }
      );
    }

    const stats = await commentInteractionUseCase.handleInteraction(commentId, action, userId);

    return NextResponse.json(
      {
        data: stats,
        message: `Comment ${action}d successfully!`,
        validationErrors: [],
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error handling comment interaction:", error);
    
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to process comment interaction",
        validationErrors: [],
        success: false,
      },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get("commentId");

  if (!commentId) {
    return NextResponse.json(
      {
        message: "Comment ID is required",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 400 }
    );
  }

  try {
    const userId = session?.user?.id;
    const stats = await commentInteractionUseCase.getCommentStats(commentId, userId);

    return NextResponse.json(
      {
        data: stats,
        message: "Comment stats retrieved successfully",
        validationErrors: [],
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching comment stats:", error);
    
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to fetch comment stats",
        validationErrors: [],
        success: false,
      },
      { status: 400 }
    );
  }
}

