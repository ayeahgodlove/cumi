import { NextRequest, NextResponse } from "next/server";
import CourseEnrollmentUsecase from "@domain/usecases/course-enrollment.usecase";
import { CourseEnrollmentMapper } from "@presentation/mappers/course-enrollment.mapper";
import { CreateCourseEnrollmentDto } from "@presentation/dtos/course-enrollment.dto";

const courseEnrollmentUsecase = new CourseEnrollmentUsecase();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let courseEnrollments;

    if (courseId) {
      courseEnrollments = await courseEnrollmentUsecase.getCourseEnrollmentsByCourseId(courseId);
    } else if (userId) {
      if (status === 'active') {
        courseEnrollments = await courseEnrollmentUsecase.getUserActiveEnrollments(userId);
      } else if (status === 'completed') {
        courseEnrollments = await courseEnrollmentUsecase.getUserCompletedEnrollments(userId);
      } else {
        courseEnrollments = await courseEnrollmentUsecase.getCourseEnrollmentsByUserId(userId);
      }
    } else {
      courseEnrollments = await courseEnrollmentUsecase.getAllCourseEnrollments();
    }

    return NextResponse.json({
      success: true,
      data: courseEnrollments.map(enrollment => CourseEnrollmentMapper.toDto(enrollment)),
    });
  } catch (error) {
    console.error('Error fetching course enrollments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course enrollments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCourseEnrollmentDto = await request.json();
    
    // Validate required fields
    if (!body.courseId || !body.userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const courseEnrollment = await courseEnrollmentUsecase.createCourseEnrollment(body);

    return NextResponse.json({
      success: true,
      data: CourseEnrollmentMapper.toDto(courseEnrollment),
      message: 'Course enrollment created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating course enrollment:', error);
    
    if (error instanceof Error && error.message.includes('already enrolled')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create course enrollment' },
      { status: 500 }
    );
  }
}
