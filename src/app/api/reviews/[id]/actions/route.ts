import { ReviewRepository } from "@data/repositories/impl/review.repository";
import { CourseRepository } from "@data/repositories/impl/course.repository";
import { ReviewUseCase } from "@domain/usecases/review.usecase";
import { ReviewMapper } from "@presentation/mappers/mapper";
import { ReviewUpdateStatusDto, ReviewHelpfulVoteDto, ReviewReportDto } from "@presentation/dtos/review-request.dto";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { NextRequest, NextResponse } from "next/server";
import { validate } from "class-validator";

const reviewRepository = new ReviewRepository();
const courseRepository = new CourseRepository();
const reviewUseCase = new ReviewUseCase(reviewRepository, courseRepository);
const reviewMapper = new ReviewMapper();

export async function POST(
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
        message: "Unauthorized: Please log in to perform this action.",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    const body = await request.json();
    const action = body.action;

    switch (action) {
      case "helpful": {
        const helpfulDto = new ReviewHelpfulVoteDto({
          id,
          userId: session.user.id,
        });

        const errors = await validate(helpfulDto);
        if (errors.length > 0) {
          return NextResponse.json(
            {
              message: "Validation failed",
              success: false,
              data: null,
              validationErrors: errors.map(error => ({
                field: error.property,
                message: Object.values(error.constraints || {}).join(", "),
              })),
            },
            { status: 400 }
          );
        }

        const review = await reviewUseCase.markReviewHelpful(id);
        const reviewData = review ? reviewMapper.toDTO(review) : null;

        return NextResponse.json(
          {
            data: reviewData,
            message: "Review marked as helpful",
            success: true,
            validationErrors: [],
          },
          { status: 200 }
        );
      }

      case "report": {
        const reportDto = new ReviewReportDto({
          id,
          userId: session.user.id,
          reason: body.reason,
        });

        const errors = await validate(reportDto);
        if (errors.length > 0) {
          return NextResponse.json(
            {
              message: "Validation failed",
              success: false,
              data: null,
              validationErrors: errors.map(error => ({
                field: error.property,
                message: Object.values(error.constraints || {}).join(", "),
              })),
            },
            { status: 400 }
          );
        }

        const review = await reviewUseCase.reportReview(id);
        const reviewData = review ? reviewMapper.toDTO(review) : null;

        return NextResponse.json(
          {
            data: reviewData,
            message: "Review reported successfully",
            success: true,
            validationErrors: [],
          },
          { status: 200 }
        );
      }

      case "approve":
      case "reject":
      case "flag": {
        // Admin-only actions
        if (session.user?.role !== "admin") {
          return NextResponse.json(
            {
              message: "Unauthorized: Admin access required for moderation actions.",
              success: false,
              data: null,
              validationErrors: [],
            },
            { status: 403 }
          );
        }

        const statusDto = new ReviewUpdateStatusDto({
          id,
          status: action === "approve" ? "approved" : action === "reject" ? "rejected" : "flagged",
          moderatorNotes: body.moderatorNotes,
        });

        const errors = await validate(statusDto);
        if (errors.length > 0) {
          return NextResponse.json(
            {
              message: "Validation failed",
              success: false,
              data: null,
              validationErrors: errors.map(error => ({
                field: error.property,
                message: Object.values(error.constraints || {}).join(", "),
              })),
            },
            { status: 400 }
          );
        }

        let review;
        if (action === "approve") {
          review = await reviewUseCase.approveReview(id, body.moderatorNotes);
        } else if (action === "reject") {
          review = await reviewUseCase.rejectReview(id, body.moderatorNotes);
        } else {
          review = await reviewUseCase.flagReview(id, body.moderatorNotes);
        }

        const reviewData = review ? reviewMapper.toDTO(review) : null;

        return NextResponse.json(
          {
            data: reviewData,
            message: `Review ${action}ed successfully`,
            success: true,
            validationErrors: [],
          },
          { status: 200 }
        );
      }

      default:
        return NextResponse.json(
          {
            message: "Invalid action. Supported actions: helpful, report, approve, reject, flag",
            success: false,
            data: null,
            validationErrors: [],
          },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error performing review action:", error);
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to perform review action",
        success: false,
        validationErrors: [],
      },
      { status: 500 }
    );
  }
}
