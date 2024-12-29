import { CourseRepository } from "@data/repositories/impl/course.repository";
import { CourseUseCase } from "@domain/usecases/course.usecase";
import { CourseMapper } from "@presentation/mappers/mapper";
import { NextResponse, NextRequest } from "next/server";

const courseRepository = new CourseRepository();
const courseUseCase = new CourseUseCase(courseRepository);
const courseMapper = new CourseMapper();

export async function GET(
  req: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category;

    const courses = await courseUseCase.getCourseByCategory(category);
    const coursesDTO = courseMapper.toDTOs(courses!);

    return NextResponse.json(coursesDTO);
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
