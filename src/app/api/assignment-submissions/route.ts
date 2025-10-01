import { AssignmentSubmissionRepository } from "@data/repositories/impl/assignment-submission.repository";
import { AssignmentSubmissionUseCase } from "@domain/usecases/assignment-submission.usecase";
import { AssignmentSubmissionMapper } from "@presentation/mappers/mapper";
import { AssignmentSubmissionRequestDto, AssignmentGradeDto } from "@presentation/dtos/assignment-submission-request.dto";
import { getServerSession } from "next-auth";
import authOptions from "@lib/options";
import { NextRequest, NextResponse } from "next/server";
import { validate } from "class-validator";
import { nanoid } from "nanoid";

export const dynamic = 'force-dynamic';

const assignmentSubmissionRepository = new AssignmentSubmissionRepository();
const assignmentSubmissionUseCase = new AssignmentSubmissionUseCase(assignmentSubmissionRepository);
const assignmentSubmissionMapper = new AssignmentSubmissionMapper();

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
        message: "Unauthorized: Please log in to submit an assignment.",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    
    // Create DTO and validate
    const submissionDto = new AssignmentSubmissionRequestDto({
      ...body,
      id: nanoid(20),
      userId: session.user.id,
      submittedAt: new Date(),
      status: 'submitted',
      attemptNumber: 1,
      isPassed: false,
      isLate: false,
    });

    const errors = await validate(submissionDto);
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

    // Submit assignment
    const submission = await assignmentSubmissionUseCase.submitAssignment(submissionDto as any);
    const submissionData = assignmentSubmissionMapper.toDTO(submission);

    return NextResponse.json(
      {
        data: submissionData,
        message: "Assignment submitted successfully!",
        success: true,
        validationErrors: [],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting assignment:", error);
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to submit assignment",
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
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");
    const assignmentId = searchParams.get("assignmentId");
    const status = searchParams.get("status");

    let submissions;

    if (userId && courseId) {
      // Get user's assignment performance for a course
      submissions = await assignmentSubmissionUseCase.getUserAssignmentPerformance(userId, courseId);
    } else if (userId) {
      // Get all user's assignment submissions
      submissions = await assignmentSubmissionUseCase.getUserAssignmentSubmissions(userId);
    } else if (assignmentId) {
      // Get all submissions for a specific assignment
      submissions = await assignmentSubmissionUseCase.getAssignmentSubmissions(assignmentId);
    } else if (courseId) {
      // Get all submissions for a course
      submissions = await assignmentSubmissionUseCase.getCourseAssignmentSubmissions(courseId);
    } else if (status) {
      // Get submissions by status (for grading)
      submissions = await assignmentSubmissionUseCase.getPendingSubmissions();
    } else {
      return NextResponse.json(
        {
          message: "Please provide userId, courseId, assignmentId, or status parameter",
          success: false,
          data: null,
          validationErrors: [],
        },
        { status: 400 }
      );
    }

    const submissionsData = assignmentSubmissionMapper.toDTOs(submissions);

    return NextResponse.json(
      {
        data: submissionsData,
        message: "Assignment submissions retrieved successfully",
        success: true,
        validationErrors: [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching assignment submissions:", error);
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to fetch assignment submissions",
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
        message: "Unauthorized: Please log in to grade assignments.",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const action = body.action;

    if (action === "grade") {
      // Grade assignment (instructor/admin only)
      if (session.user?.role !== "admin" && session.user?.role !== "instructor") {
        return NextResponse.json(
          {
            message: "Unauthorized: Only instructors can grade assignments.",
            success: false,
            data: null,
            validationErrors: [],
          },
          { status: 403 }
        );
      }

      const gradeDto = new AssignmentGradeDto({
        ...body,
        gradedBy: session.user.id,
      });

      const errors = await validate(gradeDto);
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

      const submission = await assignmentSubmissionUseCase.gradeAssignment(
        gradeDto.id,
        gradeDto.score,
        gradeDto.feedback,
        gradeDto.gradedBy
      );

      const submissionData = submission ? assignmentSubmissionMapper.toDTO(submission) : null;

      return NextResponse.json(
        {
          data: submissionData,
          message: "Assignment graded successfully!",
          success: true,
          validationErrors: [],
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Invalid action. Supported actions: grade",
          success: false,
          data: null,
          validationErrors: [],
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error processing assignment submission action:", error);
    return NextResponse.json(
      {
        data: null,
        message: error.message || "Failed to process assignment submission action",
        success: false,
        validationErrors: [],
      },
      { status: 500 }
    );
  }
}

