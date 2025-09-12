import { CourseProgress } from "@data/entities/index";
import { ICourseProgress } from "@domain/models/course-progress.model";
import { ICourseProgressRepository } from "@data/repositories/contracts/repository.base";

export class CourseProgressRepository implements ICourseProgressRepository {
  async create(data: ICourseProgress): Promise<InstanceType<typeof CourseProgress>> {
    try {
      const progress = await CourseProgress.create(data);
      return progress;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<InstanceType<typeof CourseProgress> | null> {
    try {
      const progress = await CourseProgress.findByPk(id, {
        include: [
          { model: CourseProgress.associations.enrollment.target, as: "enrollment" },
          { model: CourseProgress.associations.course.target, as: "course" },
          { model: CourseProgress.associations.user.target, as: "user" },
          { model: CourseProgress.associations.module.target, as: "module" },
          { model: CourseProgress.associations.lesson.target, as: "lesson" },
          { model: CourseProgress.associations.quiz.target, as: "quiz" },
          { model: CourseProgress.associations.assignment.target, as: "assignment" },
        ],
      });
      return progress;
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<InstanceType<typeof CourseProgress>[]> {
    try {
      const progresses = await CourseProgress.findAll({
        include: [
          { model: CourseProgress.associations.enrollment.target, as: "enrollment" },
          { model: CourseProgress.associations.course.target, as: "course" },
          { model: CourseProgress.associations.user.target, as: "user" },
          { model: CourseProgress.associations.module.target, as: "module" },
          { model: CourseProgress.associations.lesson.target, as: "lesson" },
          { model: CourseProgress.associations.quiz.target, as: "quiz" },
          { model: CourseProgress.associations.assignment.target, as: "assignment" },
        ],
        order: [['lastAccessedAt', 'DESC']],
      });
      return progresses;
    } catch (error) {
      throw error;
    }
  }

  async update(data: ICourseProgress): Promise<InstanceType<typeof CourseProgress>> {
    try {
      const [affectedCount] = await CourseProgress.update(data, {
        where: { id: data.id }
      });
      
      if (affectedCount === 0) {
        throw new Error('Course progress not found');
      }
      
      const updatedProgress = await CourseProgress.findByPk(data.id);
      return updatedProgress!;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const affectedCount = await CourseProgress.destroy({
        where: { id }
      });
      
      if (affectedCount === 0) {
        throw new Error('Course progress not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async findByEnrollmentId(enrollmentId: string): Promise<InstanceType<typeof CourseProgress>[]> {
    try {
      const progresses = await CourseProgress.findAll({
        where: { enrollmentId },
        include: [
          { model: CourseProgress.associations.enrollment.target, as: "enrollment" },
          { model: CourseProgress.associations.course.target, as: "course" },
          { model: CourseProgress.associations.user.target, as: "user" },
          { model: CourseProgress.associations.module.target, as: "module" },
          { model: CourseProgress.associations.lesson.target, as: "lesson" },
          { model: CourseProgress.associations.quiz.target, as: "quiz" },
          { model: CourseProgress.associations.assignment.target, as: "assignment" },
        ],
        order: [['lastAccessedAt', 'DESC']],
      });
      return progresses;
    } catch (error) {
      throw error;
    }
  }

  async findByCourseId(courseId: string): Promise<InstanceType<typeof CourseProgress>[]> {
    try {
      const progresses = await CourseProgress.findAll({
        where: { courseId },
        include: [
          { model: CourseProgress.associations.enrollment.target, as: "enrollment" },
          { model: CourseProgress.associations.course.target, as: "course" },
          { model: CourseProgress.associations.user.target, as: "user" },
          { model: CourseProgress.associations.module.target, as: "module" },
          { model: CourseProgress.associations.lesson.target, as: "lesson" },
          { model: CourseProgress.associations.quiz.target, as: "quiz" },
          { model: CourseProgress.associations.assignment.target, as: "assignment" },
        ],
        order: [['lastAccessedAt', 'DESC']],
      });
      return progresses;
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<InstanceType<typeof CourseProgress>[]> {
    try {
      const progresses = await CourseProgress.findAll({
        where: { userId },
        include: [
          { model: CourseProgress.associations.enrollment.target, as: "enrollment" },
          { model: CourseProgress.associations.course.target, as: "course" },
          { model: CourseProgress.associations.user.target, as: "user" },
          { model: CourseProgress.associations.module.target, as: "module" },
          { model: CourseProgress.associations.lesson.target, as: "lesson" },
          { model: CourseProgress.associations.quiz.target, as: "quiz" },
          { model: CourseProgress.associations.assignment.target, as: "assignment" },
        ],
        order: [['lastAccessedAt', 'DESC']],
      });
      return progresses;
    } catch (error) {
      throw error;
    }
  }

  async findByModuleId(moduleId: string): Promise<InstanceType<typeof CourseProgress>[]> {
    try {
      const progresses = await CourseProgress.findAll({
        where: { moduleId },
        include: [
          { model: CourseProgress.associations.enrollment.target, as: "enrollment" },
          { model: CourseProgress.associations.course.target, as: "course" },
          { model: CourseProgress.associations.user.target, as: "user" },
          { model: CourseProgress.associations.module.target, as: "module" },
          { model: CourseProgress.associations.lesson.target, as: "lesson" },
          { model: CourseProgress.associations.quiz.target, as: "quiz" },
          { model: CourseProgress.associations.assignment.target, as: "assignment" },
        ],
        order: [['lastAccessedAt', 'DESC']],
      });
      return progresses;
    } catch (error) {
      throw error;
    }
  }

  async findByLessonId(lessonId: string): Promise<InstanceType<typeof CourseProgress>[]> {
    try {
      const progresses = await CourseProgress.findAll({
        where: { lessonId },
        include: [
          { model: CourseProgress.associations.enrollment.target, as: "enrollment" },
          { model: CourseProgress.associations.course.target, as: "course" },
          { model: CourseProgress.associations.user.target, as: "user" },
          { model: CourseProgress.associations.module.target, as: "module" },
          { model: CourseProgress.associations.lesson.target, as: "lesson" },
          { model: CourseProgress.associations.quiz.target, as: "quiz" },
          { model: CourseProgress.associations.assignment.target, as: "assignment" },
        ],
        order: [['lastAccessedAt', 'DESC']],
      });
      return progresses;
    } catch (error) {
      throw error;
    }
  }

  async findByQuizId(quizId: string): Promise<InstanceType<typeof CourseProgress>[]> {
    try {
      const progresses = await CourseProgress.findAll({
        where: { quizId },
        include: [
          { model: CourseProgress.associations.enrollment.target, as: "enrollment" },
          { model: CourseProgress.associations.course.target, as: "course" },
          { model: CourseProgress.associations.user.target, as: "user" },
          { model: CourseProgress.associations.module.target, as: "module" },
          { model: CourseProgress.associations.lesson.target, as: "lesson" },
          { model: CourseProgress.associations.quiz.target, as: "quiz" },
          { model: CourseProgress.associations.assignment.target, as: "assignment" },
        ],
        order: [['lastAccessedAt', 'DESC']],
      });
      return progresses;
    } catch (error) {
      throw error;
    }
  }

  async findByAssignmentId(assignmentId: string): Promise<InstanceType<typeof CourseProgress>[]> {
    try {
      const progresses = await CourseProgress.findAll({
        where: { assignmentId },
        include: [
          { model: CourseProgress.associations.enrollment.target, as: "enrollment" },
          { model: CourseProgress.associations.course.target, as: "course" },
          { model: CourseProgress.associations.user.target, as: "user" },
          { model: CourseProgress.associations.module.target, as: "module" },
          { model: CourseProgress.associations.lesson.target, as: "lesson" },
          { model: CourseProgress.associations.quiz.target, as: "quiz" },
          { model: CourseProgress.associations.assignment.target, as: "assignment" },
        ],
        order: [['lastAccessedAt', 'DESC']],
      });
      return progresses;
    } catch (error) {
      throw error;
    }
  }

  async findByStatus(status: string): Promise<InstanceType<typeof CourseProgress>[]> {
    try {
      const progresses = await CourseProgress.findAll({
        where: { status },
        include: [
          { model: CourseProgress.associations.enrollment.target, as: "enrollment" },
          { model: CourseProgress.associations.course.target, as: "course" },
          { model: CourseProgress.associations.user.target, as: "user" },
          { model: CourseProgress.associations.module.target, as: "module" },
          { model: CourseProgress.associations.lesson.target, as: "lesson" },
          { model: CourseProgress.associations.quiz.target, as: "quiz" },
          { model: CourseProgress.associations.assignment.target, as: "assignment" },
        ],
        order: [['lastAccessedAt', 'DESC']],
      });
      return progresses;
    } catch (error) {
      throw error;
    }
  }

  async findByProgressType(progressType: string): Promise<InstanceType<typeof CourseProgress>[]> {
    try {
      const progresses = await CourseProgress.findAll({
        where: { progressType },
        include: [
          { model: CourseProgress.associations.enrollment.target, as: "enrollment" },
          { model: CourseProgress.associations.course.target, as: "course" },
          { model: CourseProgress.associations.user.target, as: "user" },
          { model: CourseProgress.associations.module.target, as: "module" },
          { model: CourseProgress.associations.lesson.target, as: "lesson" },
          { model: CourseProgress.associations.quiz.target, as: "quiz" },
          { model: CourseProgress.associations.assignment.target, as: "assignment" },
        ],
        order: [['lastAccessedAt', 'DESC']],
      });
      return progresses;
    } catch (error) {
      throw error;
    }
  }

  async updateProgress(id: string, progress: number): Promise<InstanceType<typeof CourseProgress> | null> {
    try {
      const [affectedCount] = await CourseProgress.update(
        { completionPercentage: progress },
        { where: { id } }
      );
      
      if (affectedCount === 0) {
        return null;
      }
      
      const updatedProgress = await CourseProgress.findByPk(id);
      return updatedProgress;
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(id: string, status: string): Promise<InstanceType<typeof CourseProgress> | null> {
    try {
      const [affectedCount] = await CourseProgress.update(
        { status: status as any },
        { where: { id } }
      );
      
      if (affectedCount === 0) {
        return null;
      }
      
      const updatedProgress = await CourseProgress.findByPk(id);
      return updatedProgress;
    } catch (error) {
      throw error;
    }
  }
}

export default CourseProgressRepository;
