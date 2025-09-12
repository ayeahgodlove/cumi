import { ICourseEnrollment } from "@domain/models/course-enrollment.model";
import { ICourseEnrollmentRepository } from "../contracts/repository.base";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { CourseEnrollment } from "../../entities/index";

export class CourseEnrollmentRepository implements ICourseEnrollmentRepository {
  constructor() {}

  async create(enrollment: ICourseEnrollment): Promise<InstanceType<typeof CourseEnrollment>> {
    try {
      return await CourseEnrollment.create<InstanceType<typeof CourseEnrollment>>({ ...enrollment });
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<InstanceType<typeof CourseEnrollment> | null> {
    try {
      const enrollment = await CourseEnrollment.findByPk(id);
      return enrollment;
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<InstanceType<typeof CourseEnrollment>[]> {
    try {
      const enrollments = await CourseEnrollment.findAll();
      return enrollments;
    } catch (error) {
      throw error;
    }
  }

  async update(enrollment: ICourseEnrollment): Promise<InstanceType<typeof CourseEnrollment>> {
    const { id } = enrollment;
    try {
      const enrollmentItem: any = await CourseEnrollment.findByPk(id);

      if (!enrollmentItem) {
        throw new NotFoundException("CourseEnrollment", id.toString());
      }

      return await enrollmentItem.update({ ...enrollment });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const enrollmentItem = await CourseEnrollment.findByPk(id);

      if (!enrollmentItem) {
        throw new NotFoundException("CourseEnrollment", id);
      }

      await enrollmentItem.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async findByCourseAndUser(courseId: string, userId: string): Promise<InstanceType<typeof CourseEnrollment> | null> {
    try {
      const enrollment = await CourseEnrollment.findOne({
        where: { courseId, userId },
      });
      return enrollment;
    } catch (error) {
      throw error;
    }
  }

  async findByCourseId(courseId: string): Promise<InstanceType<typeof CourseEnrollment>[]> {
    try {
      const enrollments = await CourseEnrollment.findAll({
        where: { courseId },
      });
      return enrollments;
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<InstanceType<typeof CourseEnrollment>[]> {
    try {
      const enrollments = await CourseEnrollment.findAll({
        where: { userId },
      });
      return enrollments;
    } catch (error) {
      throw error;
    }
  }

  async updateProgress(id: string, progress: number): Promise<InstanceType<typeof CourseEnrollment> | null> {
    try {
      const enrollment = await CourseEnrollment.findByPk(id);

      if (!enrollment) {
        throw new NotFoundException("CourseEnrollment", id);
      }

      return await enrollment.update({ progress });
    } catch (error) {
      throw error;
    }
  }

  async countByCourseId(courseId: string): Promise<number> {
    try {
      const count = await CourseEnrollment.count({
        where: { courseId },
      });
      return count;
    } catch (error) {
      throw error;
    }
  }
}
