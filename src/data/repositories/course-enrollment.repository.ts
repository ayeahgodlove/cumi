import CourseEnrollmentEntity from "@data/entities/course-enrollment.entity";
import { ICourseEnrollment } from "@domain/models/course-enrollment.model";

export class CourseEnrollmentRepository {
  async create(data: Partial<ICourseEnrollment>): Promise<ICourseEnrollment> {
    const courseEnrollment = await CourseEnrollmentEntity.create(data as any);
    return courseEnrollment.dataValues || courseEnrollment;
  }

  async findById(id: string): Promise<ICourseEnrollment | null> {
    const courseEnrollment = await CourseEnrollmentEntity.findByPk(id);
    return courseEnrollment ? (courseEnrollment.dataValues || courseEnrollment) : null;
  }

  async findAll(): Promise<ICourseEnrollment[]> {
    const courseEnrollments = await CourseEnrollmentEntity.findAll();
    return courseEnrollments.map((item: any) => item.dataValues || item);
  }

  async findByCourseId(courseId: string): Promise<ICourseEnrollment[]> {
    const courseEnrollments = await CourseEnrollmentEntity.findAll({
      where: { courseId }
    });
    return courseEnrollments.map((item: any) => item.dataValues || item);
  }

  async findByUserId(userId: string): Promise<ICourseEnrollment[]> {
    const courseEnrollments = await CourseEnrollmentEntity.findAll({
      where: { userId }
    });
    return courseEnrollments.map((item: any) => item.dataValues || item);
  }

  async update(id: string, data: Partial<ICourseEnrollment>): Promise<ICourseEnrollment | null> {
    const [affectedCount] = await CourseEnrollmentEntity.update(data, {
      where: { id }
    });
    
    if (affectedCount === 0) return null;
    
    const updatedCourseEnrollment = await CourseEnrollmentEntity.findByPk(id);
    return updatedCourseEnrollment ? (updatedCourseEnrollment.dataValues || updatedCourseEnrollment) : null;
  }

  async delete(id: string): Promise<boolean> {
    const affectedCount = await CourseEnrollmentEntity.destroy({
      where: { id }
    });
    return affectedCount > 0;
  }

  async findByCourseAndUser(courseId: string, userId: string): Promise<ICourseEnrollment | null> {
    const courseEnrollment = await CourseEnrollmentEntity.findOne({
      where: { courseId, userId }
    });
    return courseEnrollment ? (courseEnrollment.dataValues || courseEnrollment) : null;
  }

  async countByCourseId(courseId: string): Promise<number> {
    return await CourseEnrollmentEntity.count({
      where: { courseId }
    });
  }

  async updateProgress(id: string, progress: number): Promise<ICourseEnrollment | null> {
    const updateData: Partial<ICourseEnrollment> = { 
      progress,
      lastAccessedAt: new Date()
    };

    // If progress reaches 100%, mark as completed
    if (progress >= 100) {
      updateData.status = 'completed';
      updateData.completedAt = new Date();
    }

    return await this.update(id, updateData);
  }
}

export default CourseEnrollmentRepository;
