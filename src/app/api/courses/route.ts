import { CourseRepository } from "@data/repositories/impl/course.repository";
import { CourseUseCase } from "@domain/usecases/course.usecase";
import authOptions from "@lib/options";
import { CourseRequestDto } from "@presentation/dtos/course-request.dto";
import { CourseMapper } from "@presentation/mappers/mapper";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const courseRepository = new CourseRepository();
const courseUseCase = new CourseUseCase(courseRepository);
const courseMapper = new CourseMapper();

export async function GET(request: any) {
  try {
    const courses = await courseUseCase.getAll();
    const coursesDto = courseMapper.toDTOs(courses);
    return NextResponse.json(coursesDto);
  } catch (error: any) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions); //get session info

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Unauthorized: Please log in to access this resource.",
        success: false,
        data: null,
        validationErrors: [],
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const dto = new CourseRequestDto(body);
    const validationErrors = await validate(dto);
    const userId = session.user.id;
    // Begin transaction if needed

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          validationErrors: displayValidationErrors(validationErrors),
          success: false,
          data: null,
          message: "Attention!",
        },
        { status: 400 }
      );
    }

    const courseResponse = await courseUseCase.createCourse({
      ...dto.toData(),
      userId: userId,
    });

    return NextResponse.json(
      {
        data: courseResponse.toJSON(),
        message: "course created Successfully!",
        validationErrors: [],
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        data: null,
        message: error.message,
        validationErrors: [],
        success: false,
      },
      { status: 400 }
    );
  }
}
