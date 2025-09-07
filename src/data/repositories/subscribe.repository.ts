import { ISubscribe } from "@domain/models/subscribe.model";
import { SubscribeEntity } from "@data/entities/subscribe.entity";

export interface ISubscribeRepository {
  getAll(): Promise<ISubscribe[]>;
  getById(id: number): Promise<ISubscribe | null>;
  create(subscribe: ISubscribe): Promise<ISubscribe>;
  update(id: number, subscribe: Partial<ISubscribe>): Promise<ISubscribe | null>;
  delete(id: number): Promise<boolean>;
  getActiveSubscribers(): Promise<ISubscribe[]>;
  findByEmail(email: string): Promise<ISubscribe | null>;
}

export class SubscribeRepository implements ISubscribeRepository {
  private subscribers: ISubscribe[] = [];

  async getAll(): Promise<ISubscribe[]> {
    return this.subscribers;
  }

  async getById(id: number): Promise<ISubscribe | null> {
    return this.subscribers.find(sub => sub.id === id) || null;
  }

  async create(subscribe: ISubscribe): Promise<ISubscribe> {
    const newSubscribe = {
      ...subscribe,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.subscribers.push(newSubscribe);
    return newSubscribe;
  }

  async update(id: number, subscribe: Partial<ISubscribe>): Promise<ISubscribe | null> {
    const index = this.subscribers.findIndex(sub => sub.id === id);
    if (index === -1) return null;

    this.subscribers[index] = {
      ...this.subscribers[index],
      ...subscribe,
      updatedAt: new Date()
    };
    return this.subscribers[index];
  }

  async delete(id: number): Promise<boolean> {
    const index = this.subscribers.findIndex(sub => sub.id === id);
    if (index === -1) return false;

    this.subscribers.splice(index, 1);
    return true;
  }

  async getActiveSubscribers(): Promise<ISubscribe[]> {
    return this.subscribers.filter(sub => sub.isActive);
  }

  async findByEmail(email: string): Promise<ISubscribe | null> {
    return this.subscribers.find(sub => sub.email === email) || null;
  }
}
