import { ISubscribe } from "@domain/models/subscribe.model";
import { ISubscribeRepository } from "@data/repositories/subscribe.repository";

export class SubscribeUseCase {
  constructor(private subscribeRepository: ISubscribeRepository) {}

  async getAll(): Promise<ISubscribe[]> {
    const subscribes = await this.subscribeRepository.getAll();
    return subscribes.map((subscribe: any) => subscribe.dataValues || subscribe);
  }

  async getById(id: number): Promise<ISubscribe | null> {
    const subscribe = await this.subscribeRepository.getById(id);
    if (!subscribe) return null;
    return (subscribe as any).dataValues || subscribe;
  }

  async create(subscribeData: Partial<ISubscribe>): Promise<ISubscribe> {
    const subscribe = await this.subscribeRepository.create(subscribeData as ISubscribe);
    return (subscribe as any).dataValues || subscribe;
  }

  async update(id: number, subscribeData: Partial<ISubscribe>): Promise<ISubscribe | null> {
    const subscribe = await this.subscribeRepository.update(id, subscribeData);
    if (!subscribe) return null;
    return (subscribe as any).dataValues || subscribe;
  }

  async delete(id: number): Promise<boolean> {
    return await this.subscribeRepository.delete(id);
  }

  async getActiveSubscribers(): Promise<ISubscribe[]> {
    const subscribes = await this.subscribeRepository.getActiveSubscribers();
    return subscribes.map((subscribe: any) => subscribe.dataValues || subscribe);
  }

  async findByEmail(email: string): Promise<ISubscribe | null> {
    const subscribe = await this.subscribeRepository.findByEmail(email);
    if (!subscribe) return null;
    return (subscribe as any).dataValues || subscribe;
  }
}
