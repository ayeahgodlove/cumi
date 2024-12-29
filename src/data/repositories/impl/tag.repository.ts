import { ITag } from "@domain/models/tag";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { ITagRepository } from "../contracts/repository.base";
import Tag from "@data/entities/tag";

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
  async create(tag: ITag): Promise<Tag> {
    try {
      return await Tag.create<Tag>({ ...tag });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns Tag
   */
  async findById(id: string): Promise<Tag | null> {
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
  async findByName(name: string): Promise<Tag | null> {
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
  async getAll(): Promise<Tag[]> {
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
  async update(tag: ITag): Promise<Tag> {
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
