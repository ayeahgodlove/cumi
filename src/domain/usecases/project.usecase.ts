import { Project } from "@data/entities/index";
import { IProjectRepository } from "@data/repositories/contracts/repository.base";
import { IProject } from "@domain/models/project.model";

export class ProjectUseCase {
  /**
   *
   */
  constructor(private readonly projectRepository: IProjectRepository) {}

  async createProject(project: IProject): Promise<InstanceType<typeof Project>> {
    const existingProject = await this.projectRepository.findByTitle(
      project.title
    );

    if (existingProject) {
      throw new Error("Project already exists");
    }

    // const _project = new Project({project});
    //because it's already done in the Repository
    return this.projectRepository.create(project);
  }

  async getAll(): Promise<InstanceType<typeof Project>[]> {
    return this.projectRepository.getAll();
  }

  async getProjectById(id: string): Promise<InstanceType<typeof Project> | null> {
    return this.projectRepository.findById(id);
  }

  async getProjectBySlug(slug: string): Promise<InstanceType<typeof Project> | null> {
    return this.projectRepository.findBySlug(slug);
  }

  async updateProject(project: IProject): Promise<InstanceType<typeof Project>> {
    return this.projectRepository.update(project);
  }

  async deleteProject(id: string): Promise<void> {
    return this.projectRepository.delete(id);
  }
}

