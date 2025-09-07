import { EventRegistrationDto, CreateEventRegistrationDto, UpdateEventRegistrationDto } from "@presentation/dtos/event-registration.dto";
import { IEventRegistration } from "@domain/models/event-registration.model";

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
      dietaryRequirements: eventRegistration.dietaryRequirements,
      additionalNotes: eventRegistration.additionalNotes,
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
      dietaryRequirements: dto.dietaryRequirements,
      additionalNotes: dto.additionalNotes,
      paymentAmount: dto.paymentAmount,
      paymentMethod: dto.paymentMethod,
    };
  }
}
