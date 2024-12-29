import { LessonRepository } from "@data/repositories/impl/lesson.repository";
import { LessonUseCase } from "@domain/usecases/lesson.usecase";
import { LessonMapper } from "@presentation/mappers/mapper";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { NextResponse, NextRequest } from "next/server";

const lessonRepository = new LessonRepository();
const lessonUseCase = new LessonUseCase(lessonRepository);
const lessonMapper = new LessonMapper();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    const lesson = await lessonUseCase.getLessonBySlug(slug);
    if (!lesson) {
      throw new NotFoundException("Lesson", slug);
    }
    const lessonDTO = lessonMapper.toDTO(lesson);
    return NextResponse.json(lessonDTO);
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
