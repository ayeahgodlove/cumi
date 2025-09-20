import { ReviewRepository } from "@data/repositories/impl/review.repository";
import { ReviewUseCase } from "@domain/usecases/review.usecase";
import { ReviewMapper } from "@presentation/mappers/mapper";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { NextRequest, NextResponse } from "next/server";

const reviewRepository = new ReviewRepository();
const reviewUseCase = new ReviewUseCase(reviewRepository);
const reviewMapper = new ReviewMapper();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const review = await reviewUseCase.getReviewById(id);
    const reviewData = reviewMapper.toDTO(review);

    return NextResponse.json(
      {
        data: reviewData,
        message: "Review retrieved successfully",
        success: true,
        validationErrors: [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching review:", error);
    
    if (error.message.includes("not found")) {
      return NextResponse.json(
        {
          message: error.message,
          success: false,
          data: null,
          validationErrors: [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to fetch review",
        success: false,
        validationErrors: [],
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let session;
  
  try {
    session = await getServerSession(authOptions);
  } catch (sessionError: any) {
    console.error("Session decryption error:", sessionError);
    return NextResponse.json(
      {
        message: "Session error: Please clear your browser cookies and log in again.",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Unauthorized: Please log in to delete your review.",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    await reviewUseCase.deleteReview(id, session.user.id);

    return NextResponse.json(
      {
        data: null,
        message: "Review deleted successfully",
        success: true,
        validationErrors: [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting review:", error);
    
    if (error.message.includes("not found")) {
      return NextResponse.json(
        {
          message: error.message,
          success: false,
          data: null,
          validationErrors: [],
        },
        { status: 404 }
      );
    }

    if (error.message.includes("only delete your own")) {
      return NextResponse.json(
        {
          message: error.message,
          success: false,
          data: null,
          validationErrors: [],
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to delete review",
        success: false,
        validationErrors: [],
      },
      { status: 500 }
    );
  }
}
