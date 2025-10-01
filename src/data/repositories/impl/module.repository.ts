import { Module, Course, User, Lesson, Assignment, Quiz } from "@data/entities/index";
import { IModule } from "@domain/models/module.model";
import { IModuleRepository } from "@data/repositories/contracts/repository.base";

export class ModuleRepository implements IModuleRepository {
  async create(data: IModule): Promise<InstanceType<typeof Module>> {
    try {
      const moduleItem = await Module.create(data as any);
      return moduleItem;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<InstanceType<typeof Module> | null> {
    try {
      const moduleItem = await Module.findByPk(id, {
        include: [
          { model: Course, as: "moduleCourse" },
          { model: User, as: "instructor" },
        ],
      });
      return moduleItem;
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<InstanceType<typeof Module>[]> {
    try {
      const modules = await Module.findAll({
        include: [
          { model: Course, as: "moduleCourse" },
          { model: User, as: "instructor" },
        ],
        order: [['moduleOrder', 'ASC']],
      });
      return modules;
    } catch (error) {
      throw error;
    }
  }

  async update(data: IModule): Promise<InstanceType<typeof Module>> {
    try {
      const [affectedCount] = await Module.update(data, {
        where: { id: data.id }
      });
      
      if (affectedCount === 0) {
        throw new Error('Module not found');
      }
      
      const updatedModule = await Module.findByPk(data.id);
      return updatedModule!;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const affectedCount = await Module.destroy({
        where: { id }
      });
      
      if (affectedCount === 0) {
        throw new Error('Module not found');
      }
    } catch (error) {
      throw error;
    }
  }

  async findByTitle(title: string): Promise<InstanceType<typeof Module> | null> {
    try {
      const moduleItem = await Module.findOne({
        where: { title },
        include: [
          { model: Course, as: "moduleCourse" },
          { model: User, as: "instructor" },
        ],
      });
      return moduleItem;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<InstanceType<typeof Module> | null> {
    try {
      const moduleItem = await Module.findOne({
        where: { slug },
        include: [
          { model: Course, as: "moduleCourse" },
          { model: User, as: "instructor" },
        ],
      });
      return moduleItem;
    } catch (error) {
      throw error;
    }
  }

  async findByCourseId(courseId: string): Promise<InstanceType<typeof Module>[]> {
    try {
      const modules = await Module.findAll({
        where: { courseId },
        include: [
          { model: Course, as: "moduleCourse" },
          { model: User, as: "instructor" },
        ],
        order: [['moduleOrder', 'ASC']],
      });
      return modules;
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<InstanceType<typeof Module>[]> {
    try {
      const modules = await Module.findAll({
        where: { userId },
        include: [
          { model: Course, as: "moduleCourse" },
          { model: User, as: "instructor" },
        ],
        order: [['createdAt', 'DESC']],
      });
      return modules;
    } catch (error) {
      throw error;
    }
  }

  async findByStatus(status: string): Promise<InstanceType<typeof Module>[]> {
    try {
      const modules = await Module.findAll({
        where: { status },
        include: [
          { model: Course, as: "moduleCourse" },
          { model: User, as: "instructor" },
        ],
        order: [['moduleOrder', 'ASC']],
      });
      return modules;
    } catch (error) {
      throw error;
    }
  }

  async findByCourseIdWithLessons(courseId: string): Promise<InstanceType<typeof Module>[]> {
    try {
      
      const modules = await Module.findAll({
        where: { 
          courseId,
          status: 'published'
        },
        include: [
          { model: Course, as: "moduleCourse" },
          { model: User, as: "instructor" },
          { 
            model: Lesson, 
            as: "lessons",
            where: { status: 'published' },
            required: false,
            include: [
              {
                model: Assignment,
                as: "assignments",
                where: { status: 'published' },
                required: false,
              },
              {
                model: Quiz,
                as: "quizzes", 
                where: { status: 'published' },
                required: false,
              }
            ]
          }
        ],
        order: [
          ['moduleOrder', 'ASC'],
          [{ model: Lesson, as: "lessons" }, 'lessonOrder', 'ASC']
        ],
      });
      return modules;
    } catch (error) {
      console.error("Error in findByCourseIdWithLessons:", error);
      throw error;
    }
  }
}

export default ModuleRepository;
