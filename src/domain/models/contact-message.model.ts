export interface IContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const emptyContactMessage: IContactMessage = {
  id: 0,
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  isRead: false,
  repliedAt: undefined,
  createdAt: new Date(),
  updatedAt: new Date()
};
