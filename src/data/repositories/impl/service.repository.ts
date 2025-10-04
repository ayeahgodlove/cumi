import { IService } from "@domain/models/service.model";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { IServiceRepository } from "../contracts/repository.base";
import { Service } from "../../entities/index";
export class ServiceRepository implements IServiceRepository {
  constructor() {}

  /**
   * Receives a Service as parameter
   * @service
   * returns void
   */
  async create(service: IService): Promise<InstanceType<typeof Service>> {
    try {
      return await Service.create<InstanceType<typeof Service>>({ ...service });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns Service
   */
  async findById(id: string): Promise<InstanceType<typeof Service> | null> {
    try {
      const serviceItem = await Service.findByPk(id);
      if (!serviceItem) {
        throw new NotFoundException("Service", id);
      }
      return serviceItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @title
   * returns Service
   */
  async findByTitle(title: string): Promise<InstanceType<typeof Service> | null> {
    try {
      const serviceItem = await Service.findOne({ where: { title } });
      return serviceItem;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<InstanceType<typeof Service> | null> {
    try {
      const service = await Service.findOne({ where: { slug } });
      return service;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Returns an array of Service
   */
  async getAll(): Promise<InstanceType<typeof Service>[]> {
    try {
      const services = await Service.findAll();
      return services;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a Service as parameter
   * @service
   * returns void
   */
  async update(service: IService): Promise<InstanceType<typeof Service>> {
    const { id } = service;
    try {
      const serviceItem: any = await Service.findByPk(id);

      if (!serviceItem) {
        throw new NotFoundException("Service", id.toString());
      }

      return await serviceItem?.update({ ...service });
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
      const serviceItem = await Service.findByPk(id);

      if (!serviceItem) {
        throw new NotFoundException("Service", id);
      }

      await serviceItem?.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }
}

