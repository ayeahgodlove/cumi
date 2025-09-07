import { IContactMessage } from "@domain/models/contact-message.model";
import { ContactMessageEntity } from "@data/entities/contact-message.entity";

export interface IContactMessageRepository {
  getAll(): Promise<IContactMessage[]>;
  getById(id: number): Promise<IContactMessage | null>;
  create(contactMessage: IContactMessage): Promise<IContactMessage>;
  update(id: number, contactMessage: Partial<IContactMessage>): Promise<IContactMessage | null>;
  delete(id: number): Promise<boolean>;
  getUnreadMessages(): Promise<IContactMessage[]>;
  markAsRead(id: number): Promise<boolean>;
}

export class ContactMessageRepository implements IContactMessageRepository {
  private messages: IContactMessage[] = [];

  async getAll(): Promise<IContactMessage[]> {
    return this.messages;
  }

  async getById(id: number): Promise<IContactMessage | null> {
    return this.messages.find(msg => msg.id === id) || null;
  }

  async create(contactMessage: IContactMessage): Promise<IContactMessage> {
    const newMessage = {
      ...contactMessage,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  async update(id: number, contactMessage: Partial<IContactMessage>): Promise<IContactMessage | null> {
    const index = this.messages.findIndex(msg => msg.id === id);
    if (index === -1) return null;

    this.messages[index] = {
      ...this.messages[index],
      ...contactMessage,
      updatedAt: new Date()
    };
    return this.messages[index];
  }

  async delete(id: number): Promise<boolean> {
    const index = this.messages.findIndex(msg => msg.id === id);
    if (index === -1) return false;

    this.messages.splice(index, 1);
    return true;
  }

  async getUnreadMessages(): Promise<IContactMessage[]> {
    return this.messages.filter(msg => !msg.isRead);
  }

  async markAsRead(id: number): Promise<boolean> {
    const message = await this.getById(id);
    if (!message) return false;

    return await this.update(id, { isRead: true }) !== null;
  }
}
