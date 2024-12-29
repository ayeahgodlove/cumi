import { IProject } from "@domain/models/project.model";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { IProjectRepository } from "../contracts/repository.base";
import Project from "@data/entities/project";
export class ProjectRepository implements IProjectRepository {
  constructor() {}

  /**
   * Receives a Project as parameter
   * @project
   * returns void
   */
  async create(project: IProject): Promise<Project> {
    try {
      return await Project.create<Project>({ ...project });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns Project
   */
  async findById(id: string): Promise<Project | null> {
    try {
      const projectItem = await Project.findByPk(id);

      if (!projectItem) {
        throw new NotFoundException("Project", id);
      }
      return projectItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @title
   * returns Project
   */
  async findByTitle(title: string): Promise<Project | null> {
    try {
      const projectItem = await Project.findOne({ where: { title } });
      return projectItem;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<Project | null> {
    try {
      const project = await Project.findOne({ where: { slug } });
      return project;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Returns an array of Project
   */
  async getAll(): Promise<Project[]> {
    try {
      const categories = await Project.findAll();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a Project as parameter
   * @project
   * returns void
   */
  async update(project: IProject): Promise<Project> {
    const { id } = project;
    try {
      const projectItem: any = await Project.findByPk(id);

      if (!projectItem) {
        throw new NotFoundException("Project", id.toString());
      }

      return await projectItem?.update({ ...project });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a string as parameter
   * @id
   * returns void
   */
  async delete(id: string): Promise<void> {
    try {
      const projectItem = await Project.findByPk(id);

      if (!projectItem) {
        throw new NotFoundException("Project", id);
      }

      await projectItem?.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
