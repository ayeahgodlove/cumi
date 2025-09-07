import { IContactMessage } from "@domain/models/contact-message.model";
import { IContactMessageRepository } from "@data/repositories/contact-message.repository";

export class ContactMessageUseCase {
  constructor(private contactMessageRepository: IContactMessageRepository) {}

  async getAll(): Promise<IContactMessage[]> {
    const messages = await this.contactMessageRepository.getAll();
    return messages.map((message: any) => message.dataValues || message);
  }

  async getById(id: number): Promise<IContactMessage | null> {
    const message = await this.contactMessageRepository.getById(id);
    if (!message) return null;
    return (message as any).dataValues || message;
  }

  async create(messageData: Partial<IContactMessage>): Promise<IContactMessage> {
    const message = await this.contactMessageRepository.create(messageData as IContactMessage);
    return (message as any).dataValues || message;
  }

  async update(id: number, messageData: Partial<IContactMessage>): Promise<IContactMessage | null> {
    const message = await this.contactMessageRepository.update(id, messageData);
    if (!message) return null;
    return (message as any).dataValues || message;
  }

  async delete(id: number): Promise<boolean> {
    return await this.contactMessageRepository.delete(id);
  }

  async getUnreadMessages(): Promise<IContactMessage[]> {
    const messages = await this.contactMessageRepository.getUnreadMessages();
    return messages.map((message: any) => message.dataValues || message);
  }

  async markAsRead(id: number): Promise<boolean> {
    return await this.contactMessageRepository.markAsRead(id);
  }
}
