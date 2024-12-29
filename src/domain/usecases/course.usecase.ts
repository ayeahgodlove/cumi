import Course from "@data/entities/course";
import { ICourseRepository } from "@data/repositories/contracts/repository.base";
import { ICourse } from "@domain/models/course";

export class CourseUseCase {
  /**
   *
   */
  constructor(
    private readonly courseRepository: ICourseRepository
  ) {}

  async createCourse(course: ICourse): Promise<Course> {
    const existingCourse = await this.courseRepository.findByTitle(course.title);

    if (existingCourse) {
      throw new Error("Course already exists");
    }

    // const _course = new Course({course});
    //because it's already done in the Repository
    return this.courseRepository.create(course);
  }

  async getCourseBySlug(slug: string): Promise<Course | null> {
    return this.courseRepository.findBySlug(slug);
  }
  async getCourseByCategory(category: string): Promise<Course[] | null> {
    return this.courseRepository.findByCategory(category);
  }


  async getAll(): Promise<Course[]> {
    return this.courseRepository.getAll();
  }

  async getCourseById(id: string): Promise<Course | null> {
    return this.courseRepository.findById(id);
  }

  async updateCourse(course: ICourse): Promise<Course> {
    return this.courseRepository.update(course);
  }

  async deleteCourse(id: string): Promise<void> {
    return this.courseRepository.delete(id);
  }
}
