import EventRegistrationRepository from "@data/repositories/event-registration.repository";
import { IEventRegistration, EventRegistrationCreationAttributes } from "@domain/models/event-registration.model";

export class EventRegistrationUsecase {
  private eventRegistrationRepository: EventRegistrationRepository;

  constructor() {
    this.eventRegistrationRepository = new EventRegistrationRepository();
  }

  async createEventRegistration(data: EventRegistrationCreationAttributes): Promise<IEventRegistration> {
    // Check if user is already registered for this event
    const existingRegistration = await this.eventRegistrationRepository.findByEventAndUser(
      data.eventId,
      data.userId
    );

    if (existingRegistration) {
      throw new Error('User is already registered for this event');
    }

    return await this.eventRegistrationRepository.create(data);
  }

  async getEventRegistrationById(id: string): Promise<IEventRegistration | null> {
    return await this.eventRegistrationRepository.findById(id);
  }

  async getAllEventRegistrations(): Promise<IEventRegistration[]> {
    return await this.eventRegistrationRepository.findAll();
  }

  async getEventRegistrationsByEventId(eventId: string): Promise<IEventRegistration[]> {
    return await this.eventRegistrationRepository.findByEventId(eventId);
  }

  async getEventRegistrationsByUserId(userId: string): Promise<IEventRegistration[]> {
    return await this.eventRegistrationRepository.findByUserId(userId);
  }

  async updateEventRegistration(id: string, data: Partial<IEventRegistration>): Promise<IEventRegistration | null> {
    return await this.eventRegistrationRepository.update(id, data);
  }

  async deleteEventRegistration(id: string): Promise<boolean> {
    return await this.eventRegistrationRepository.delete(id);
  }

  async cancelEventRegistration(id: string): Promise<IEventRegistration | null> {
    return await this.eventRegistrationRepository.update(id, { 
      status: 'cancelled' 
    });
  }

  async confirmEventRegistration(id: string): Promise<IEventRegistration | null> {
    return await this.eventRegistrationRepository.update(id, { 
      status: 'confirmed' 
    });
  }

  async updatePaymentStatus(id: string, paymentStatus: 'pending' | 'paid' | 'refunded', paymentData?: {
    amount?: number;
    method?: string;
    reference?: string;
  }): Promise<IEventRegistration | null> {
    const updateData: Partial<IEventRegistration> = { paymentStatus };
    
    if (paymentData) {
      if (paymentData.amount !== undefined) updateData.paymentAmount = paymentData.amount;
      if (paymentData.method) updateData.paymentMethod = paymentData.method;
      if (paymentData.reference) updateData.paymentReference = paymentData.reference;
    }

    return await this.eventRegistrationRepository.update(id, updateData);
  }

  async getEventRegistrationCount(eventId: string): Promise<number> {
    return await this.eventRegistrationRepository.countByEventId(eventId);
  }

  async checkUserRegistration(eventId: string, userId: string): Promise<boolean> {
    const registration = await this.eventRegistrationRepository.findByEventAndUser(eventId, userId);
    return registration !== null;
  }
}

export default EventRegistrationUsecase;

