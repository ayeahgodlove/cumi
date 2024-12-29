import { CourseRepository } from "@data/repositories/impl/course.repository";
import { emptyCourse, ICourse } from "@domain/models/course";
import { CourseUseCase } from "@domain/usecases/course.usecase";
import { CourseRequestDto } from "@presentation/dtos/course-request.dto";
import { CourseMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { displayValidationErrors } from "@utils/displayValidationErrors";
import { validate } from "class-validator";
import { NextResponse, NextRequest } from "next/server";

const courseRepository = new CourseRepository();
const courseUseCase = new CourseUseCase(courseRepository);
const courseMapper = new CourseMapper();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const dto = new CourseRequestDto(await req.json());
  const validationErrors = await validate(dto);
  const userId = req.headers.get("X-User-Id") || "";

  if (validationErrors.length > 0) {
    return NextResponse.json(
      {
        validationErrors: displayValidationErrors(validationErrors) as any,
        success: false,
        data: null,
        message: "Attention!",
      },
      { status: 400 }
    );
  } else {
    try {
      const id = params.id;
      const obj: ICourse = {
        ...emptyCourse,
        ...dto.toData(),
        id: id,
        userId,
      };
      const updatedCourse = await courseUseCase.updateCourse(obj);
      const courseDto = courseMapper.toDTO(updatedCourse);

      return NextResponse.json(
        {
          data: courseDto,
          message: "Course Updated Successfully!",
          validationErrors: [],
          success: true,
        },
        { status: 200 }
      );
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
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const course = await courseUseCase.getCourseById(id);
    if (!course) {
      throw new NotFoundException("Course", id);
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    await courseUseCase.deleteCourse(id);

    return NextResponse.json({
      message: `Operation successfully completed!`,
      validationErrors: [],
      success: true,
      data: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
        data: null,
        validationErrors: [error],
        success: true,
      },
      { status: 400 }
    );
  }
}
