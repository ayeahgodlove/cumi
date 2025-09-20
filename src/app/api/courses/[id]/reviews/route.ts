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
    const { id: courseId } = params;
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get("includeStats") === "true";
    const userId = searchParams.get("userId");

    let response: any = {};

    if (userId) {
      // Get user's review for this course
      const userReview = await reviewUseCase.getUserReviewForCourse(userId, courseId);
      response.userReview = userReview ? reviewMapper.toDTO(userReview) : null;
    }

    // Get all approved reviews for this course
    const reviews = await reviewUseCase.getReviewsByCourseId(courseId);
    response.reviews = reviewMapper.toDTOs(reviews);

    if (includeStats) {
      // Get review statistics
      response.stats = await reviewUseCase.getCourseReviewStats(courseId);
    }

    return NextResponse.json(
      {
        data: response,
        message: "Course reviews retrieved successfully",
        success: true,
        validationErrors: [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching course reviews:", error);
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to fetch course reviews",
        success: false,
        validationErrors: [],
      },
      { status: 500 }
    );
  }
}
