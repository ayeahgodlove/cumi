import { Module } from "@data/entities/index";
import { IModuleRepository } from "@data/repositories/contracts/repository.base";
import { IModule } from "@domain/models/module.model";

export class ModuleUseCase {
  /**
   *
   */
  constructor(
    private readonly moduleRepository: IModuleRepository
  ) {}

  async createModule(module: IModule): Promise<InstanceType<typeof Module>> {
    const existingModule = await this.moduleRepository.findByTitle(module.title);

    if (existingModule) {
      throw new Error("Module already exists");
    }

    return this.moduleRepository.create(module);
  }

  async getAll(): Promise<InstanceType<typeof Module>[]> {
    return this.moduleRepository.getAll();
  }

  async getModuleById(id: string): Promise<InstanceType<typeof Module> | null> {
    return this.moduleRepository.findById(id);
  }

  async getModuleBySlug(slug: string): Promise<InstanceType<typeof Module> | null> {
    return this.moduleRepository.findBySlug(slug);
  }

  async getModulesByCourseId(courseId: string): Promise<InstanceType<typeof Module>[]> {
    return this.moduleRepository.findByCourseId(courseId);
  }

  async updateModule(module: IModule): Promise<InstanceType<typeof Module>> {
    return this.moduleRepository.update(module);
  }

  async deleteModule(id: string): Promise<void> {
    return this.moduleRepository.delete(id);
  }
}
