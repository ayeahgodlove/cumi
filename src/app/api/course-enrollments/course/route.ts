import { CourseEnrollmentRepository } from "@data/repositories/impl/course-enrollment.repository";
import { CourseEnrollmentUseCase } from "@domain/usecases/course-enrollment.usecase";
import { NextRequest, NextResponse } from "next/server";

const courseEnrollmentRepository = new CourseEnrollmentRepository();
const courseEnrollmentUseCase = new CourseEnrollmentUseCase(courseEnrollmentRepository);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    
    if (!courseId) {
      return NextResponse.json(
        {
          message: "Course ID is required",
          success: false,
          data: null,
          validationErrors: [],
        },
        { status: 400 }
      );
    }

    // Get all enrollments for the specific course
    const enrollments = await courseEnrollmentUseCase.getEnrollmentsByCourseId(courseId);
    
    return NextResponse.json({
      data: enrollments,
      message: "Course enrollments retrieved successfully",
      success: true,
      validationErrors: [],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message,
        validationErrors: [error],
        success: false,
      },
      { status: 400 }
    );
  }
}
