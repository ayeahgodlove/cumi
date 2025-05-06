import { IEvent } from "@domain/models/event.model";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { IEventRepository } from "../contracts/repository.base";
import sequelize from "@database/db-sequelize.config";
import { Event, EventTag, Tag } from "../../entities/index";
export class EventRepository implements IEventRepository {
  constructor() {}

  /**
   * Receives a Event as parameter
   * @event
   * returns void
   */
  async create(event: IEvent): Promise<InstanceType<typeof Event>> {
    // Begin transaction if needed
    const transaction = await sequelize.transaction();
    try {
      const { tags, ...rest } = event;
      const eventItem = await Event.create<InstanceType<typeof Event>>({ ...rest }, { transaction });

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
  async findById(id: string): Promise<InstanceType<typeof Event> | null> {
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
  async findByTitle(title: string): Promise<InstanceType<typeof Event> | null> {
    try {
      const eventItem = await Event.findOne({ where: { title }, include: Tag });
      return eventItem;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<InstanceType<typeof Event> | null> {
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
  async getAll(): Promise<InstanceType<typeof Event>[]> {
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
  async update(event: IEvent): Promise<InstanceType<typeof Event>> {
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
