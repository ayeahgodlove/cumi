import { CourseProgress } from "@data/entities/index";
import { ICourseProgressRepository } from "@data/repositories/contracts/repository.base";
import { ICourseProgress } from "@domain/models/course-progress.model";

export class CourseProgressUseCase {
  /**
   *
   */
  constructor(
    private readonly courseProgressRepository: ICourseProgressRepository
  ) {}

  async createCourseProgress(courseProgress: ICourseProgress): Promise<InstanceType<typeof CourseProgress>> {
    return this.courseProgressRepository.create(courseProgress);
  }

  async getAll(): Promise<InstanceType<typeof CourseProgress>[]> {
    return this.courseProgressRepository.getAll();
  }

  async getCourseProgressById(id: string): Promise<InstanceType<typeof CourseProgress> | null> {
    return this.courseProgressRepository.findById(id);
  }

  async getCourseProgressByUserId(userId: string): Promise<InstanceType<typeof CourseProgress>[]> {
    return this.courseProgressRepository.findByUserId(userId);
  }

  async getCourseProgressByCourseId(courseId: string): Promise<InstanceType<typeof CourseProgress>[]> {
    return this.courseProgressRepository.findByCourseId(courseId);
  }

  async getCourseProgressByEnrollmentId(enrollmentId: string): Promise<InstanceType<typeof CourseProgress>[]> {
    return this.courseProgressRepository.findByEnrollmentId(enrollmentId);
  }

  async updateCourseProgress(courseProgress: ICourseProgress): Promise<InstanceType<typeof CourseProgress>> {
    return this.courseProgressRepository.update(courseProgress);
  }

  async deleteCourseProgress(id: string): Promise<void> {
    return this.courseProgressRepository.delete(id);
  }
}
