import { ReviewRepository } from "@data/repositories/impl/review.repository";
import { CourseRepository } from "@data/repositories/impl/course.repository";
import { ReviewUseCase } from "@domain/usecases/review.usecase";
import { ReviewMapper } from "@presentation/mappers/mapper";
import { ReviewRequestDto } from "@presentation/dtos/review-request.dto";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { NextRequest, NextResponse } from "next/server";
import { validate } from "class-validator";
import { nanoid } from "nanoid";

export const dynamic = 'force-dynamic';

const reviewRepository = new ReviewRepository();
const courseRepository = new CourseRepository();
const reviewUseCase = new ReviewUseCase(reviewRepository, courseRepository);
const reviewMapper = new ReviewMapper();

export async function POST(request: NextRequest) {
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
        message: "Unauthorized: Please log in to submit a review.",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    
    console.log("Review submission body:", body);
    console.log("User ID:", session.user.id);
    
    // Create DTO and validate
    const reviewDto = new ReviewRequestDto({
      ...body,
      id: nanoid(20),
      userId: session.user.id,
      status: 'pending',
      helpfulVotes: 0,
    });

    const errors = await validate(reviewDto);
    if (errors.length > 0) {
      const validationErrors = errors.map(error => ({
        field: error.property,
        message: Object.values(error.constraints || {}).join(", "),
      }));

      return NextResponse.json(
        {
          message: "Validation failed",
          success: false,
          data: null,
          validationErrors,
        },
        { status: 400 }
      );
    }

    // Create review
    const review = await reviewUseCase.createReview(reviewDto as any);
    const reviewData = reviewMapper.toDTO(review);

    return NextResponse.json(
      {
        data: reviewData,
        message: "Review submitted successfully! It will be reviewed by our team before being published.",
        success: true,
        validationErrors: [],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating review:", error);
    
    if (error.message.includes("already submitted a review")) {
      return NextResponse.json(
        {
          message: error.message,
          success: false,
          data: null,
          validationErrors: [],
        },
        { status: 409 } // Conflict
      );
    }

    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to submit review",
        success: false,
        validationErrors: [],
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    let reviews;

    if (courseId) {
      // Get reviews for a specific course
      reviews = await reviewUseCase.getReviewsByCourseId(courseId);
    } else if (userId) {
      // Get reviews by a specific user
      reviews = await reviewUseCase.getReviewsByUserId(userId);
    } else if (status) {
      // Get reviews by status (for moderation)
      const session = await getServerSession(authOptions);
      if (!session || session.user?.role !== "admin") {
        return NextResponse.json(
          {
            message: "Unauthorized: Admin access required",
            success: false,
            data: null,
            validationErrors: [],
          },
          { status: 403 }
        );
      }
      reviews = await reviewUseCase.getPendingReviews();
    } else {
      // Get all approved reviews
      reviews = await reviewUseCase.getAllReviews();
    }

    const reviewsData = reviewMapper.toDTOs(reviews);

    return NextResponse.json(
      {
        data: reviewsData,
        message: "Reviews retrieved successfully",
        success: true,
        validationErrors: [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to fetch reviews",
        success: false,
        validationErrors: [],
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
        message: "Unauthorized: Please log in to update your review.",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    
    // Ensure user can only update their own review
    body.userId = session.user.id;
    
    // Create DTO and validate
    const reviewDto = new ReviewRequestDto(body);
    const errors = await validate(reviewDto);
    
    if (errors.length > 0) {
      const validationErrors = errors.map(error => ({
        field: error.property,
        message: Object.values(error.constraints || {}).join(", "),
      }));

      return NextResponse.json(
        {
          message: "Validation failed",
          success: false,
          data: null,
          validationErrors,
        },
        { status: 400 }
      );
    }

    // Update review
    const review = await reviewUseCase.updateReview(reviewDto as any);
    const reviewData = reviewMapper.toDTO(review);

    return NextResponse.json(
      {
        data: reviewData,
        message: "Review updated successfully! It will be reviewed by our team before being published.",
        success: true,
        validationErrors: [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to update review",
        success: false,
        validationErrors: [],
      },
      { status: 500 }
    );
  }
}

