import { ITag } from "@domain/models/tag";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { ITagRepository } from "../contracts/repository.base";
import { Tag } from "../../entities/index";

export class TagRepository implements ITagRepository {
  /**
   *
   */
  constructor() {}

  /**
   * Receives a Tag as parameter
   * @tag
   * returns void
   */
  async create(tag: ITag): Promise<InstanceType<typeof Tag>> {
    try {
      return await Tag.create<InstanceType<typeof Tag>>({ ...tag });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns Tag
   */
  async findById(id: string): Promise<InstanceType<typeof Tag> | null> {
    try {
      const tagItem = await Tag.findByPk(id);

      if (!tagItem) {
        throw new NotFoundException("Tag", id);
      }
      return tagItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @name
   * returns Category
   */
  async findByName(name: string): Promise<InstanceType<typeof Tag> | null> {
    try {
      const tag = await Tag.findOne({ where: { name } });
      return tag;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Returns an array of Tag
   */
  async getAll(): Promise<InstanceType<typeof Tag>[]> {
    try {
      const categories = await Tag.findAll();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a Tag as parameter
   * @tag
   * returns void
   */
  async update(tag: ITag): Promise<InstanceType<typeof Tag>> {
    const { id } = tag;
    try {
      const tagItem: any = await Tag.findByPk(id);

      if (!tagItem) {
        throw new NotFoundException("Tag", id.toString());
      }

      return await tagItem?.update({ ...tag });
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
      const tagItem = await Tag.findByPk(id);

      if (!tagItem) {
        throw new NotFoundException("Tag", id);
      }

      await tagItem?.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
