import { ICourseRepository } from "@data/repositories/contracts/repository.base";
import { ICourse } from "@domain/models/course";
import { Course } from "@data/entities/index";
export class CourseUseCase {
  /**
   *
   */
  constructor(
    private readonly courseRepository: ICourseRepository
  ) {}

  async createCourse(course: ICourse): Promise<InstanceType<typeof Course>> {
    const existingCourse = await this.courseRepository.findByTitle(course.title);

    if (existingCourse) {
      throw new Error("Course already exists");
    }

    // const _course = new Course({course});
    //because it's already done in the Repository
    return this.courseRepository.create(course);
  }

  async getCourseBySlug(slug: string): Promise<InstanceType<typeof Course> | null> {
    return this.courseRepository.findBySlug(slug);
  }
  async getCourseByCategory(category: string): Promise<InstanceType<typeof Course>[] | null> {
    return this.courseRepository.findByCategory(category);
  }

  async getAll(): Promise<InstanceType<typeof Course>[]> {
    return this.courseRepository.getAll();
  }

  async getCourseById(id: string): Promise<InstanceType<typeof Course> | null> {
    return this.courseRepository.findById(id);
  }

  async updateCourse(course: ICourse): Promise<InstanceType<typeof Course>> {
    return this.courseRepository.update(course);
  }

  async deleteCourse(id: string): Promise<void> {
    return this.courseRepository.delete(id);
  }
}

