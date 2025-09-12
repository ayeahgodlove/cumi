import { CourseRepository } from "@data/repositories/impl/course.repository";
import { CourseUseCase } from "@domain/usecases/course.usecase";
import { CourseMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { NextResponse, NextRequest } from "next/server";

const courseRepository = new CourseRepository();
const courseUseCase = new CourseUseCase(courseRepository);
const courseMapper = new CourseMapper();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    const course = await courseUseCase.getCourseBySlug(slug);
    
    if (!course) {
      throw new NotFoundException("Course", slug);
    }
    
    const courseDTO = courseMapper.toDTO(course);
    return NextResponse.json(courseDTO);
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
