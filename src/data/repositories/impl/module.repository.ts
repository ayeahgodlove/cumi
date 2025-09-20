import { Module } from "@data/entities/index";
import { IModule } from "@domain/models/module.model";
import { IModuleRepository } from "@data/repositories/contracts/repository.base";

export class ModuleRepository implements IModuleRepository {
  async create(data: IModule): Promise<InstanceType<typeof Module>> {
    try {
      const module = await Module.create(data);
      return module;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<InstanceType<typeof Module> | null> {
    try {
      const module = await Module.findByPk(id, {
        include: [
          { model: Module.associations.course.target, as: "course" },
          { model: Module.associations.instructor.target, as: "instructor" },
        ],
      });
      return module;
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<InstanceType<typeof Module>[]> {
    try {
      const modules = await Module.findAll({
        include: [
          { model: Module.associations.course.target, as: "course" },
          { model: Module.associations.instructor.target, as: "instructor" },
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
      const module = await Module.findOne({
        where: { title },
        include: [
          { model: Module.associations.course.target, as: "course" },
          { model: Module.associations.instructor.target, as: "instructor" },
        ],
      });
      return module;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<InstanceType<typeof Module> | null> {
    try {
      const module = await Module.findOne({
        where: { slug },
        include: [
          { model: Module.associations.course.target, as: "course" },
          { model: Module.associations.instructor.target, as: "instructor" },
        ],
      });
      return module;
    } catch (error) {
      throw error;
    }
  }

  async findByCourseId(courseId: string): Promise<InstanceType<typeof Module>[]> {
    try {
      const modules = await Module.findAll({
        where: { courseId },
        include: [
          { model: Module.associations.course.target, as: "course" },
          { model: Module.associations.instructor.target, as: "instructor" },
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
          { model: Module.associations.course.target, as: "course" },
          { model: Module.associations.instructor.target, as: "instructor" },
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
          { model: Module.associations.course.target, as: "course" },
          { model: Module.associations.instructor.target, as: "instructor" },
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
      // Import the models we need for associations
      const { Lesson, Assignment, Quiz } = require("@data/entities/index");
      
      const modules = await Module.findAll({
        where: { 
          courseId,
          status: 'published'
        },
        include: [
          { model: Module.associations.course.target, as: "course" },
          { model: Module.associations.instructor.target, as: "instructor" },
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
