import { IContactMessage } from "@domain/models/contact-message.model";

export class ContactMessageEntity {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public phone?: string,
    public subject: string = "",
    public message: string = "",
    public isRead: boolean = false,
    public repliedAt?: Date,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  static fromModel(model: IContactMessage): ContactMessageEntity {
    return new ContactMessageEntity(
      model.id,
      model.name,
      model.email,
      model.phone,
      model.subject,
      model.message,
      model.isRead,
      model.repliedAt,
      model.createdAt,
      model.updatedAt
    );
  }

  toModel(): IContactMessage {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      subject: this.subject,
      message: this.message,
      isRead: this.isRead,
      repliedAt: this.repliedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

