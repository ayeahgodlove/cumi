import { NextRequest, NextResponse } from "next/server";
import CourseEnrollmentUsecase from "@domain/usecases/course-enrollment.usecase";
import { CourseEnrollmentMapper } from "@presentation/mappers/course-enrollment.mapper";

const courseEnrollmentUsecase = new CourseEnrollmentUsecase();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseEnrollment = await courseEnrollmentUsecase.getCourseEnrollmentById(params.id);

    if (!courseEnrollment) {
      return NextResponse.json(
        { success: false, error: 'Course enrollment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: CourseEnrollmentMapper.toDto(courseEnrollment),
    });
  } catch (error) {
    console.error('Error fetching course enrollment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course enrollment' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const courseEnrollment = await courseEnrollmentUsecase.updateCourseEnrollment(params.id, body);

    if (!courseEnrollment) {
      return NextResponse.json(
        { success: false, error: 'Course enrollment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: CourseEnrollmentMapper.toDto(courseEnrollment),
      message: 'Course enrollment updated successfully',
    });
  } catch (error) {
    console.error('Error updating course enrollment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update course enrollment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await courseEnrollmentUsecase.deleteCourseEnrollment(params.id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Course enrollment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Course enrollment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting course enrollment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete course enrollment' },
      { status: 500 }
    );
  }
}
