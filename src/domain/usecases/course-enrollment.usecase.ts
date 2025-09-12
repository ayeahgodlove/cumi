import { CourseEnrollmentRepository } from "@data/repositories/impl/course-enrollment.repository";
import { ICourseEnrollment } from "@domain/models/course-enrollment.model";
import { CourseEnrollment } from "@data/entities/index";

export class CourseEnrollmentUseCase {
  private courseEnrollmentRepository: CourseEnrollmentRepository;

  constructor(courseEnrollmentRepository: CourseEnrollmentRepository) {
    this.courseEnrollmentRepository = courseEnrollmentRepository;
  }

  async createEnrollment(data: ICourseEnrollment): Promise<InstanceType<typeof CourseEnrollment>> {
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

  async getEnrollmentById(id: string): Promise<InstanceType<typeof CourseEnrollment> | null> {
    return await this.courseEnrollmentRepository.findById(id);
  }

  async getAll(): Promise<InstanceType<typeof CourseEnrollment>[]> {
    return await this.courseEnrollmentRepository.getAll();
  }

  async getEnrollmentsByCourseId(courseId: string): Promise<InstanceType<typeof CourseEnrollment>[]> {
    return await this.courseEnrollmentRepository.findByCourseId(courseId);
  }

  async getEnrollmentsByUserId(userId: string): Promise<InstanceType<typeof CourseEnrollment>[]> {
    return await this.courseEnrollmentRepository.findByUserId(userId);
  }

  async updateEnrollment(id: string, data: Partial<ICourseEnrollment>): Promise<InstanceType<typeof CourseEnrollment> | null> {
    const enrollment = await this.courseEnrollmentRepository.findById(id);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }
    return await this.courseEnrollmentRepository.update({ ...enrollment.toJSON(), ...data });
  }

  async deleteEnrollment(id: string): Promise<void> {
    return await this.courseEnrollmentRepository.delete(id);
  }

  async updateProgress(id: string, progress: number): Promise<InstanceType<typeof CourseEnrollment> | null> {
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }

    return await this.courseEnrollmentRepository.updateProgress(id, progress);
  }

  async dropCourse(id: string): Promise<InstanceType<typeof CourseEnrollment> | null> {
    const enrollment = await this.courseEnrollmentRepository.findById(id);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }
    return await this.courseEnrollmentRepository.update({ ...enrollment.toJSON(), status: 'dropped' });
  }

  async suspendCourse(id: string): Promise<InstanceType<typeof CourseEnrollment> | null> {
    const enrollment = await this.courseEnrollmentRepository.findById(id);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }
    return await this.courseEnrollmentRepository.update({ ...enrollment.toJSON(), status: 'suspended' });
  }

  async reactivateCourse(id: string): Promise<InstanceType<typeof CourseEnrollment> | null> {
    const enrollment = await this.courseEnrollmentRepository.findById(id);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }
    return await this.courseEnrollmentRepository.update({ ...enrollment.toJSON(), status: 'active' });
  }

  async issueCertificate(id: string, certificateUrl: string): Promise<InstanceType<typeof CourseEnrollment> | null> {
    const enrollment = await this.courseEnrollmentRepository.findById(id);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }
    return await this.courseEnrollmentRepository.update({ 
      ...enrollment.toJSON(), 
      certificateIssued: true,
      certificateUrl 
    });
  }

  async getEnrollmentCount(courseId: string): Promise<number> {
    return await this.courseEnrollmentRepository.countByCourseId(courseId);
  }

  async checkUserEnrollment(courseId: string, userId: string): Promise<boolean> {
    const enrollment = await this.courseEnrollmentRepository.findByCourseAndUser(courseId, userId);
    return enrollment !== null;
  }

  async getUserActiveEnrollments(userId: string): Promise<InstanceType<typeof CourseEnrollment>[]> {
    const enrollments = await this.courseEnrollmentRepository.findByUserId(userId);
    return enrollments.filter(enrollment => enrollment.status === 'active');
  }

  async getUserCompletedEnrollments(userId: string): Promise<InstanceType<typeof CourseEnrollment>[]> {
    const enrollments = await this.courseEnrollmentRepository.findByUserId(userId);
    return enrollments.filter(enrollment => enrollment.status === 'completed');
  }
}

export default CourseEnrollmentUseCase;
