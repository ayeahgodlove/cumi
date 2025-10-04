import { IContactMessage } from "@domain/models/contact-message.model";
import { ContactMessage } from "@data/entities/index";
import { IContactMessageRepository } from "@data/repositories/contact-message.repository";

export class ContactMessageRepository implements IContactMessageRepository {
  async getAll(): Promise<IContactMessage[]> {
    try {
      const messages = await ContactMessage.findAll();
      return messages.map((msg: any) => ({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        phone: msg.phone,
        subject: msg.subject,
        message: msg.message,
        isRead: msg.isRead,
        repliedAt: msg.repliedAt,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return [];
    }
  }

  async getById(id: number): Promise<IContactMessage | null> {
    try {
      const message = await ContactMessage.findByPk(id);
      if (!message) return null;

      return {
        id: (message as any).id,
        name: (message as any).name,
        email: (message as any).email,
        phone: (message as any).phone,
        subject: (message as any).subject,
        message: (message as any).message,
        isRead: (message as any).isRead,
        repliedAt: (message as any).repliedAt,
        createdAt: (message as any).createdAt,
        updatedAt: (message as any).updatedAt
      };
    } catch (error) {
      console.error('Error fetching contact message:', error);
      return null;
    }
  }

  async create(contactMessage: IContactMessage): Promise<IContactMessage> {
    try {
      const newMessage = await ContactMessage.create({
        name: contactMessage.name,
        email: contactMessage.email,
        phone: contactMessage.phone,
        subject: contactMessage.subject,
        message: contactMessage.message,
        isRead: contactMessage.isRead || false,
        repliedAt: contactMessage.repliedAt
      });

      return {
        id: (newMessage as any).id,
        name: (newMessage as any).name,
        email: (newMessage as any).email,
        phone: (newMessage as any).phone,
        subject: (newMessage as any).subject,
        message: (newMessage as any).message,
        isRead: (newMessage as any).isRead,
        repliedAt: (newMessage as any).repliedAt,
        createdAt: (newMessage as any).createdAt,
        updatedAt: (newMessage as any).updatedAt
      };
    } catch (error) {
      console.error('Error creating contact message:', error);
      throw error;
    }
  }

  async update(id: number, contactMessage: Partial<IContactMessage>): Promise<IContactMessage | null> {
    try {
      const message = await ContactMessage.findByPk(id);
      if (!message) return null;

      await (message as any).update({
        name: contactMessage.name,
        email: contactMessage.email,
        phone: contactMessage.phone,
        subject: contactMessage.subject,
        message: contactMessage.message,
        isRead: contactMessage.isRead,
        repliedAt: contactMessage.repliedAt
      });

      return {
        id: (message as any).id,
        name: (message as any).name,
        email: (message as any).email,
        phone: (message as any).phone,
        subject: (message as any).subject,
        message: (message as any).message,
        isRead: (message as any).isRead,
        repliedAt: (message as any).repliedAt,
        createdAt: (message as any).createdAt,
        updatedAt: (message as any).updatedAt
      };
    } catch (error) {
      console.error('Error updating contact message:', error);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const message = await ContactMessage.findByPk(id);
      if (!message) return false;

      await (message as any).destroy();
      return true;
    } catch (error) {
      console.error('Error deleting contact message:', error);
      return false;
    }
  }

  async getUnreadMessages(): Promise<IContactMessage[]> {
    try {
      const messages = await ContactMessage.findAll({
        where: { isRead: false }
      });
      return messages.map((msg: any) => ({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        phone: msg.phone,
        subject: msg.subject,
        message: msg.message,
        isRead: msg.isRead,
        repliedAt: msg.repliedAt,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt
      }));
    } catch (error) {
      console.error('Error fetching unread messages:', error);
      return [];
    }
  }

  async markAsRead(id: number): Promise<boolean> {
    try {
      const message = await ContactMessage.findByPk(id);
      if (!message) return false;

      await (message as any).update({ isRead: true });
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  }
}

