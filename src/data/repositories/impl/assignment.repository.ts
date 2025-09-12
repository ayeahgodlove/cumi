import { Assignment } from "@data/entities/index";
import { IAssignment } from "@domain/models/assignment.model";
import { IAssignmentRepository } from "@data/repositories/contracts/repository.base";

export class AssignmentRepository implements IAssignmentRepository {
  async create(data: IAssignment): Promise<InstanceType<typeof Assignment>> {
    try {
      const assignment = await Assignment.create(data);
      return assignment;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<InstanceType<typeof Assignment> | null> {
    try {
      const assignment = await Assignment.findByPk(id, {
        include: [
          { model: Assignment.associations.course.target, as: "course" },
          { model: Assignment.associations.module.target, as: "module" },
          { model: Assignment.associations.lesson.target, as: "lesson" },
          { model: Assignment.associations.instructor.target, as: "instructor" },
        ],
      });
      return assignment;
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<InstanceType<typeof Assignment>[]> {
    try {
      const assignments = await Assignment.findAll({
        include: [
          { model: Assignment.associations.course.target, as: "course" },
          { model: Assignment.associations.module.target, as: "module" },
          { model: Assignment.associations.lesson.target, as: "lesson" },
          { model: Assignment.associations.instructor.target, as: "instructor" },
        ],
        order: [['assignmentOrder', 'ASC']],
      });
      return assignments;
    } catch (error) {
      throw error;
    }
  }

  async update(data: IAssignment): Promise<InstanceType<typeof Assignment>> {
    try {
      const [affectedCount] = await Assignment.update(data, {
        where: { id: data.id }
      });
      
      if (affectedCount === 0) {
        throw new Error('Assignment not found');
      }
      
      const updatedAssignment = await Assignment.findByPk(data.id);
      return updatedAssignment!;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const affectedCount = await Assignment.destroy({
        where: { id }
      });
      
      if (affectedCount === 0) {
        throw new Error('Assignment not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async findByTitle(title: string): Promise<InstanceType<typeof Assignment> | null> {
    try {
      const assignment = await Assignment.findOne({
        where: { title },
        include: [
          { model: Assignment.associations.course.target, as: "course" },
          { model: Assignment.associations.module.target, as: "module" },
          { model: Assignment.associations.lesson.target, as: "lesson" },
          { model: Assignment.associations.instructor.target, as: "instructor" },
        ],
      });
      return assignment;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<InstanceType<typeof Assignment> | null> {
    try {
      const assignment = await Assignment.findOne({
        where: { slug },
        include: [
          { model: Assignment.associations.course.target, as: "course" },
          { model: Assignment.associations.module.target, as: "module" },
          { model: Assignment.associations.lesson.target, as: "lesson" },
          { model: Assignment.associations.instructor.target, as: "instructor" },
        ],
      });
      return assignment;
    } catch (error) {
      throw error;
    }
  }

  async findByCourseId(courseId: string): Promise<InstanceType<typeof Assignment>[]> {
    try {
      const assignments = await Assignment.findAll({
        where: { courseId },
        include: [
          { model: Assignment.associations.course.target, as: "course" },
          { model: Assignment.associations.module.target, as: "module" },
          { model: Assignment.associations.lesson.target, as: "lesson" },
          { model: Assignment.associations.instructor.target, as: "instructor" },
        ],
        order: [['assignmentOrder', 'ASC']],
      });
      return assignments;
    } catch (error) {
      throw error;
    }
  }

  async findByModuleId(moduleId: string): Promise<InstanceType<typeof Assignment>[]> {
    try {
      const assignments = await Assignment.findAll({
        where: { moduleId },
        include: [
          { model: Assignment.associations.course.target, as: "course" },
          { model: Assignment.associations.module.target, as: "module" },
          { model: Assignment.associations.lesson.target, as: "lesson" },
          { model: Assignment.associations.instructor.target, as: "instructor" },
        ],
        order: [['assignmentOrder', 'ASC']],
      });
      return assignments;
    } catch (error) {
      throw error;
    }
  }

  async findByLessonId(lessonId: string): Promise<InstanceType<typeof Assignment>[]> {
    try {
      const assignments = await Assignment.findAll({
        where: { lessonId },
        include: [
          { model: Assignment.associations.course.target, as: "course" },
          { model: Assignment.associations.module.target, as: "module" },
          { model: Assignment.associations.lesson.target, as: "lesson" },
          { model: Assignment.associations.instructor.target, as: "instructor" },
        ],
        order: [['assignmentOrder', 'ASC']],
      });
      return assignments;
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<InstanceType<typeof Assignment>[]> {
    try {
      const assignments = await Assignment.findAll({
        where: { userId },
        include: [
          { model: Assignment.associations.course.target, as: "course" },
          { model: Assignment.associations.module.target, as: "module" },
          { model: Assignment.associations.lesson.target, as: "lesson" },
          { model: Assignment.associations.instructor.target, as: "instructor" },
        ],
        order: [['createdAt', 'DESC']],
      });
      return assignments;
    } catch (error) {
      throw error;
    }
  }

  async findByStatus(status: string): Promise<InstanceType<typeof Assignment>[]> {
    try {
      const assignments = await Assignment.findAll({
        where: { status },
        include: [
          { model: Assignment.associations.course.target, as: "course" },
          { model: Assignment.associations.module.target, as: "module" },
          { model: Assignment.associations.lesson.target, as: "lesson" },
          { model: Assignment.associations.instructor.target, as: "instructor" },
        ],
        order: [['assignmentOrder', 'ASC']],
      });
      return assignments;
    } catch (error) {
      throw error;
    }
  }

  async findByType(type: string): Promise<InstanceType<typeof Assignment>[]> {
    try {
      const assignments = await Assignment.findAll({
        where: { assignmentType: type },
        include: [
          { model: Assignment.associations.course.target, as: "course" },
          { model: Assignment.associations.module.target, as: "module" },
          { model: Assignment.associations.lesson.target, as: "lesson" },
          { model: Assignment.associations.instructor.target, as: "instructor" },
        ],
        order: [['assignmentOrder', 'ASC']],
      });
      return assignments;
    } catch (error) {
      throw error;
    }
  }
}

export default AssignmentRepository;
