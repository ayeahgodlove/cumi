import { Event } from "@data/entities/index";
import { IEventRepository } from "@data/repositories/contracts/repository.base";
import { IEvent } from "@domain/models/event.model";

export class EventUseCase {
  /**
   *
   */ 
  constructor(private readonly eventRepository: IEventRepository) {}

  async createEvent(event: IEvent): Promise<InstanceType<typeof Event>> {
    const existingEvent = await this.eventRepository.findByTitle(
      event.title
    );

    if (existingEvent) {
      throw new Error("Event already exists");
    }

    // const _event = new Event({event});
    //because it's already done in the Repository
    return this.eventRepository.create(event);
  }

  async getAll(): Promise<InstanceType<typeof Event>[]> {
    return this.eventRepository.getAll();
  }

  async getEventById(id: string): Promise<InstanceType<typeof Event> | null> {
    return this.eventRepository.findById(id);
  }

  async getEventBySlug(slug: string): Promise<InstanceType<typeof Event> | null> {
    return this.eventRepository.findBySlug(slug);
  }

  async updateEvent(event: IEvent): Promise<InstanceType<typeof Event>> {
    return this.eventRepository.update(event);
  }

  async deleteEvent(id: string): Promise<void> {
    return this.eventRepository.delete(id);
  }
}
