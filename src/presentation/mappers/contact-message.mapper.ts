import { IContactMessage } from "@domain/models/contact-message.model";

export interface ContactMessageDTO {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export class ContactMessageMapper {
  toDTO(message: IContactMessage): ContactMessageDTO {
    return {
      id: message.id,
      name: message.name,
      email: message.email,
      phone: message.phone,
      subject: message.subject,
      message: message.message,
      isRead: message.isRead,
      repliedAt: message.repliedAt?.toISOString(),
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString()
    };
  }

  toDTOs(messages: IContactMessage[]): ContactMessageDTO[] {
    return messages.map(message => this.toDTO(message));
  }

  toModel(dto: ContactMessageDTO): IContactMessage {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      subject: dto.subject,
      message: dto.message,
      isRead: dto.isRead,
      repliedAt: dto.repliedAt ? new Date(dto.repliedAt) : undefined,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt)
    };
  }
}

export const contactMessageMapper = new ContactMessageMapper();

