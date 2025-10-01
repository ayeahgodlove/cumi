import { IEventRegistration } from "@domain/models/event-registration.model";

export interface EventRegistrationDto {
  id: string;
  eventId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  registrationDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentAmount?: number;
  paymentMethod?: string;
  paymentReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRegistrationDto {
  eventId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  paymentAmount?: number;
  paymentMethod?: string;
}

export interface UpdateEventRegistrationDto {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  paymentAmount?: number;
  paymentMethod?: string;
  paymentReference?: string;
}

export class EventRegistrationMapper {
  static toDto(eventRegistration: IEventRegistration): EventRegistrationDto {
    return {
      id: eventRegistration.id,
      eventId: eventRegistration.eventId,
      userId: eventRegistration.userId,
      name: eventRegistration.name,
      email: eventRegistration.email,
      phone: eventRegistration.phone,
      company: eventRegistration.company,
      registrationDate: eventRegistration.registrationDate.toISOString(),
      status: eventRegistration.status,
      paymentStatus: eventRegistration.paymentStatus,
      paymentAmount: eventRegistration.paymentAmount,
      paymentMethod: eventRegistration.paymentMethod,
      paymentReference: eventRegistration.paymentReference,
      createdAt: eventRegistration.createdAt.toISOString(),
      updatedAt: eventRegistration.updatedAt.toISOString(),
    };
  }

  static toModel(dto: CreateEventRegistrationDto): Partial<IEventRegistration> {
    return {
      eventId: dto.eventId,
      userId: dto.userId,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      company: dto.company,
      paymentAmount: dto.paymentAmount,
      paymentMethod: dto.paymentMethod,
    };
  }
}
