import { Lesson } from "@data/entities/index";
import { ILessonRepository } from "@data/repositories/contracts/repository.base";
import { ILesson } from "@domain/models/lesson";

export class LessonUseCase {
  /**
   *
   */
  constructor(
    private readonly lessonRepository: ILessonRepository
  ) {}

  async createLesson(lesson: ILesson): Promise<InstanceType<typeof Lesson>> {
    const existingLesson = await this.lessonRepository.findByTitle(lesson.title);

    if (existingLesson) {
      throw new Error("Lesson already exists");
    }

    // const _lesson = new Lesson({lesson});
    //because it's already done in the Repository
    return this.lessonRepository.create(lesson);
  }

  async getAll(): Promise<InstanceType<typeof Lesson>[]> {
    return this.lessonRepository.getAll();
  }

  async getLessonById(id: string): Promise<InstanceType<typeof Lesson> | null> {
    return this.lessonRepository.findById(id);
  } 

  async getLessonBySlug(slug: string): Promise<InstanceType<typeof Lesson> | null> {
    return this.lessonRepository.findBySlug(slug);
  }

  async getLessonsByCourseId(courseId: string): Promise<InstanceType<typeof Lesson>[]> {
    return this.lessonRepository.findByCourseId(courseId);
  }

  async updateLesson(lesson: ILesson): Promise<InstanceType<typeof Lesson>> {
    return this.lessonRepository.update(lesson);
  }

  async deleteLesson(id: string): Promise<void> {
    return this.lessonRepository.delete(id);
  }
}
