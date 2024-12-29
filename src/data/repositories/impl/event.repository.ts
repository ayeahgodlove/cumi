import { IEvent } from "@domain/models/event.model";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { IEventRepository } from "../contracts/repository.base";
import Event from "@data/entities/event";
import EventTag from "@data/entities/event_tag";
import Tag from "@data/entities/tag";
import sequelize from "@database/db-sequelize.config";
export class EventRepository implements IEventRepository {
  constructor() {}

  /**
   * Receives a Event as parameter
   * @event
   * returns void
   */
  async create(event: IEvent): Promise<Event> {
    // Begin transaction if needed
    const transaction = await sequelize.transaction();
    try {
      const { tags, ...rest } = event;
      const eventItem = await Event.create<Event>({ ...rest }, { transaction });

      await Promise.all(
        tags.map((tagId) =>
          EventTag.create(
            { eventId: event.id, tagId: tagId },
            {
              transaction,
              ignoreDuplicates: true,
              returning: false,
            }
          )
        )
      );
      // Commit transaction
      await transaction.commit();
      return eventItem;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns Event
   */
  async findById(id: string): Promise<Event | null> {
    try {
      const eventItem = await Event.findByPk(id, { include: Tag });

      if (!eventItem) {
        throw new NotFoundException("Event", id);
      }
      return eventItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @title
   * returns Event
   */
  async findByTitle(title: string): Promise<Event | null> {
    try {
      const eventItem = await Event.findOne({ where: { title }, include: Tag });
      return eventItem;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<Event | null> {
    try {
      const event = await Event.findOne({ where: { slug }, include: Tag });
      return event;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Returns an array of Event
   */
  async getAll(): Promise<Event[]> {
    try {
      const categories = await Event.findAll({ include: Tag });
      return categories;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a Event as parameter
   * @event
   * returns void
   */
  async update(event: IEvent): Promise<Event> {
    const { id } = event;
    try {
      const eventItem: any = await Event.findByPk(id);

      if (!eventItem) {
        throw new NotFoundException("Event", id.toString());
      }

      return await eventItem?.update({ ...event });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a string as parameter
   * @id
   * returns void
   */
  async delete(id: string): Promise<void> {
    try {
      const eventItem = await Event.findByPk(id);

      if (!eventItem) {
        throw new NotFoundException("Event", id);
      }

      await eventItem?.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
