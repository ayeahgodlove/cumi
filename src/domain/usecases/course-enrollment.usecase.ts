import CourseEnrollmentRepository from "@data/repositories/course-enrollment.repository";
import { ICourseEnrollment, CourseEnrollmentCreationAttributes } from "@domain/models/course-enrollment.model";

export class CourseEnrollmentUsecase {
  private courseEnrollmentRepository: CourseEnrollmentRepository;

  constructor() {
    this.courseEnrollmentRepository = new CourseEnrollmentRepository();
  }

  async createCourseEnrollment(data: CourseEnrollmentCreationAttributes): Promise<ICourseEnrollment> {
    // Check if user is already enrolled in this course
    const existingEnrollment = await this.courseEnrollmentRepository.findByCourseAndUser(
      data.courseId,
      data.userId
    );

    if (existingEnrollment) {
      throw new Error('User is already enrolled in this course');
    }

    return await this.courseEnrollmentRepository.create(data);
  }

  async getCourseEnrollmentById(id: string): Promise<ICourseEnrollment | null> {
    return await this.courseEnrollmentRepository.findById(id);
  }

  async getAllCourseEnrollments(): Promise<ICourseEnrollment[]> {
    return await this.courseEnrollmentRepository.findAll();
  }

  async getCourseEnrollmentsByCourseId(courseId: string): Promise<ICourseEnrollment[]> {
    return await this.courseEnrollmentRepository.findByCourseId(courseId);
  }

  async getCourseEnrollmentsByUserId(userId: string): Promise<ICourseEnrollment[]> {
    return await this.courseEnrollmentRepository.findByUserId(userId);
  }

  async updateCourseEnrollment(id: string, data: Partial<ICourseEnrollment>): Promise<ICourseEnrollment | null> {
    return await this.courseEnrollmentRepository.update(id, data);
  }

  async deleteCourseEnrollment(id: string): Promise<boolean> {
    return await this.courseEnrollmentRepository.delete(id);
  }

  async updateProgress(id: string, progress: number): Promise<ICourseEnrollment | null> {
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }

    return await this.courseEnrollmentRepository.updateProgress(id, progress);
  }

  async dropCourse(id: string): Promise<ICourseEnrollment | null> {
    return await this.courseEnrollmentRepository.update(id, { 
      status: 'dropped' 
    });
  }

  async suspendCourse(id: string): Promise<ICourseEnrollment | null> {
    return await this.courseEnrollmentRepository.update(id, { 
      status: 'suspended' 
    });
  }

  async reactivateCourse(id: string): Promise<ICourseEnrollment | null> {
    return await this.courseEnrollmentRepository.update(id, { 
      status: 'active' 
    });
  }

  async issueCertificate(id: string, certificateUrl: string): Promise<ICourseEnrollment | null> {
    return await this.courseEnrollmentRepository.update(id, { 
      certificateIssued: true,
      certificateUrl 
    });
  }

  async getCourseEnrollmentCount(courseId: string): Promise<number> {
    return await this.courseEnrollmentRepository.countByCourseId(courseId);
  }

  async checkUserEnrollment(courseId: string, userId: string): Promise<boolean> {
    const enrollment = await this.courseEnrollmentRepository.findByCourseAndUser(courseId, userId);
    return enrollment !== null;
  }

  async getUserActiveEnrollments(userId: string): Promise<ICourseEnrollment[]> {
    const enrollments = await this.courseEnrollmentRepository.findByUserId(userId);
    return enrollments.filter(enrollment => enrollment.status === 'active');
  }

  async getUserCompletedEnrollments(userId: string): Promise<ICourseEnrollment[]> {
    const enrollments = await this.courseEnrollmentRepository.findByUserId(userId);
    return enrollments.filter(enrollment => enrollment.status === 'completed');
  }
}

export default CourseEnrollmentUsecase;
