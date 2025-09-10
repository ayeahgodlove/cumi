import { ISubscriber } from "@domain/models/subscriber.model";
import { Subscriber } from "@data/entities/index";

export class SubscriberRepository {
  async getAll(): Promise<ISubscriber[]> {
    try {
      const subscribers = await Subscriber.findAll({
        order: [["subscribedAt", "DESC"]],
      });
      return subscribers.map((subscriber: any) => ({
        id: subscriber.id,
        email: subscriber.email,
        name: subscriber.name,
        isActive: subscriber.isActive,
        subscribedAt: subscriber.subscribedAt,
        createdAt: subscriber.createdAt,
        updatedAt: subscriber.updatedAt
      }));
    } catch (error) {
      console.error("Error getting all subscribers:", error);
      return [];
    }
  }

  async getById(id: number): Promise<ISubscriber | null> {
    try {
      const subscriber = await Subscriber.findByPk(id);
      if (!subscriber) return null;

      return {
        id: (subscriber as any).id,
        email: (subscriber as any).email,
        name: (subscriber as any).name,
        isActive: (subscriber as any).isActive,
        subscribedAt: (subscriber as any).subscribedAt,
        createdAt: (subscriber as any).createdAt,
        updatedAt: (subscriber as any).updatedAt
      };
    } catch (error) {
      console.error("Error getting subscriber by id:", error);
      return null;
    }
  }

  async create(subscriber: ISubscriber): Promise<ISubscriber> {
    try {
      const newSubscriber = await Subscriber.create({
        email: subscriber.email,
        name: subscriber.name,
        isActive: subscriber.isActive,
        subscribedAt: subscriber.subscribedAt
      });

      return {
        id: (newSubscriber as any).id,
        email: (newSubscriber as any).email,
        name: (newSubscriber as any).name,
        isActive: (newSubscriber as any).isActive,
        subscribedAt: (newSubscriber as any).subscribedAt,
        createdAt: (newSubscriber as any).createdAt,
        updatedAt: (newSubscriber as any).updatedAt
      };
    } catch (error) {
      console.error("Error creating subscriber:", error);
      throw error;
    }
  }

  async update(id: number, subscriber: Partial<ISubscriber>): Promise<ISubscriber | null> {
    try {
      const existingSubscriber = await Subscriber.findByPk(id);
      if (!existingSubscriber) return null;

      await existingSubscriber.update({
        email: subscriber.email,
        name: subscriber.name,
        isActive: subscriber.isActive,
        subscribedAt: subscriber.subscribedAt
      });

      return {
        id: (existingSubscriber as any).id,
        email: (existingSubscriber as any).email,
        name: (existingSubscriber as any).name,
        isActive: (existingSubscriber as any).isActive,
        subscribedAt: (existingSubscriber as any).subscribedAt,
        createdAt: (existingSubscriber as any).createdAt,
        updatedAt: (existingSubscriber as any).updatedAt
      };
    } catch (error) {
      console.error("Error updating subscriber:", error);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const subscriber = await Subscriber.findByPk(id);
      if (!subscriber) return false;

      await subscriber.destroy();
      return true;
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      return false;
    }
  }

  async getByEmail(email: string): Promise<ISubscriber | null> {
    try {
      const subscriber = await Subscriber.findOne({
        where: { email },
      });
      if (!subscriber) return null;

      return {
        id: (subscriber as any).id,
        email: (subscriber as any).email,
        name: (subscriber as any).name,
        isActive: (subscriber as any).isActive,
        subscribedAt: (subscriber as any).subscribedAt,
        createdAt: (subscriber as any).createdAt,
        updatedAt: (subscriber as any).updatedAt
      };
    } catch (error) {
      console.error("Error getting subscriber by email:", error);
      return null;
    }
  }

  async getActiveSubscribers(): Promise<ISubscriber[]> {
    try {
      const subscribers = await Subscriber.findAll({
        where: { isActive: true },
        order: [["subscribedAt", "DESC"]],
      });
      return subscribers.map((subscriber: any) => ({
        id: subscriber.id,
        email: subscriber.email,
        name: subscriber.name,
        isActive: subscriber.isActive,
        subscribedAt: subscriber.subscribedAt,
        createdAt: subscriber.createdAt,
        updatedAt: subscriber.updatedAt
      }));
    } catch (error) {
      console.error("Error getting active subscribers:", error);
      return [];
    }
  }
}
