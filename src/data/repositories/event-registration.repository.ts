import { EventRegistration } from "@data/entities/index";
import { IEventRegistration, EventRegistrationCreationAttributes } from "@domain/models/event-registration.model";

export class EventRegistrationRepository {
  async create(data: EventRegistrationCreationAttributes): Promise<IEventRegistration> {
    const eventRegistration = await EventRegistration.create(data);
    return eventRegistration.dataValues || eventRegistration;
  }

  async findById(id: string): Promise<IEventRegistration | null> {
    const eventRegistration = await EventRegistration.findByPk(id);
    return eventRegistration ? (eventRegistration.dataValues || eventRegistration) : null;
  }

  async findAll(): Promise<IEventRegistration[]> {
    const eventRegistrations = await EventRegistration.findAll();
    return eventRegistrations.map((item: any) => item.dataValues || item);
  }

  async findByEventId(eventId: string): Promise<IEventRegistration[]> {
    const eventRegistrations = await EventRegistration.findAll({
      where: { eventId }
    });
    return eventRegistrations.map((item: any) => item.dataValues || item);
  }

  async findByUserId(userId: string): Promise<IEventRegistration[]> {
    const eventRegistrations = await EventRegistration.findAll({
      where: { userId }
    });
    return eventRegistrations.map((item: any) => item.dataValues || item);
  }

  async update(id: string, data: Partial<IEventRegistration>): Promise<IEventRegistration | null> {
    const [affectedCount] = await EventRegistration.update(data, {
      where: { id }
    });
    
    if (affectedCount === 0) return null;
    
    const updatedEventRegistration = await EventRegistration.findByPk(id);
    return updatedEventRegistration ? (updatedEventRegistration.dataValues || updatedEventRegistration) : null;
  }

  async delete(id: string): Promise<boolean> {
    const affectedCount = await EventRegistration.destroy({
      where: { id }
    });
    return affectedCount > 0;
  }

  async findByEventAndUser(eventId: string, userId: string): Promise<IEventRegistration | null> {
    const eventRegistration = await EventRegistration.findOne({
      where: { eventId, userId }
    });
    return eventRegistration ? (eventRegistration.dataValues || eventRegistration) : null;
  }

  async countByEventId(eventId: string): Promise<number> {
    return await EventRegistration.count({
      where: { eventId }
    });
  }
}

export default EventRegistrationRepository;

