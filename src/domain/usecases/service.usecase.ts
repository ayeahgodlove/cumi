import { Service } from "@data/entities/index";
import { IServiceRepository } from "@data/repositories/contracts/repository.base";
import { IService } from "@domain/models/service.model";

export class ServiceUseCase {
  /**
   *
   */
  constructor(private readonly serviceRepository: IServiceRepository) {}

  async createService(
    service: IService
  ): Promise<InstanceType<typeof Service>> {
    const existingService = await this.serviceRepository.findByTitle(
      service.title
    );

    if (existingService) {
      throw new Error("Service already exists");
    }

    // const _service = new Service({service});
    //because it's already done in the Repository
    return this.serviceRepository.create(service);
  }

  async getAll(): Promise<InstanceType<typeof Service>[]> {
    return this.serviceRepository.getAll();
  }

  async getServiceById(
    id: string
  ): Promise<InstanceType<typeof Service> | null> {
    return this.serviceRepository.findById(id);
  }

  async getServiceBySlug(
    slug: string
  ): Promise<InstanceType<typeof Service> | null> {
    return this.serviceRepository.findBySlug(slug);
  }

  async updateService(
    service: IService
  ): Promise<InstanceType<typeof Service>> {
    return this.serviceRepository.update(service);
  }

  async deleteService(id: string): Promise<void> {
    return this.serviceRepository.delete(id);
  }
}
