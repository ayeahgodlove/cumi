import { ISubscriber } from "@domain/models/subscriber.model";
import { SubscriberRepository } from "@data/repositories/impl/subscriber.repository";

export class SubscriberUseCase {
  constructor(private subscriberRepository: SubscriberRepository) {}

  async getAll(): Promise<ISubscriber[]> {
    return await this.subscriberRepository.getAll();
  }

  async getById(id: number): Promise<ISubscriber | null> {
    return await this.subscriberRepository.getById(id);
  }

  async getByEmail(email: string): Promise<ISubscriber | null> {
    return await this.subscriberRepository.getByEmail(email);
  }

  async getActiveSubscribers(): Promise<ISubscriber[]> {
    return await this.subscriberRepository.getActiveSubscribers();
  }

  async create(subscriberData: Partial<ISubscriber>): Promise<ISubscriber> {
    // Check if subscriber already exists
    const existingSubscriber = await this.getByEmail(subscriberData.email!);
    if (existingSubscriber) {
      throw new Error("Subscriber with this email already exists");
    }

    const subscriberToCreate: ISubscriber = {
      id: 0, // Will be set by the database
      email: subscriberData.email!,
      name: subscriberData.name || '',
      isActive: subscriberData.isActive ?? true,
      subscribedAt: subscriberData.subscribedAt || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await this.subscriberRepository.create(subscriberToCreate);
  }

  async update(id: number, subscriberData: Partial<ISubscriber>): Promise<ISubscriber> {
    const updatedSubscriber = await this.subscriberRepository.update(id, subscriberData);
    if (!updatedSubscriber) {
      throw new Error("Subscriber not found");
    }
    return updatedSubscriber;
  }

  async delete(id: number): Promise<boolean> {
    return await this.subscriberRepository.delete(id);
  }

  async unsubscribe(email: string): Promise<boolean> {
    const subscriber = await this.getByEmail(email);
    if (!subscriber) {
      throw new Error("Subscriber not found");
    }

    await this.update(subscriber.id, { isActive: false });
    return true;
  }
}
