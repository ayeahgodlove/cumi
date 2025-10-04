import { ICategory } from "@domain/models/category";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { ICategoryRepository } from "../contracts/repository.base";
import { Category, Post } from "../../entities/index";
export class CategoryRepository implements ICategoryRepository {
  constructor() {}

  /**
   * Receives a Category as parameter
   * @category
   * returns void
   */
  async create(category: ICategory): Promise<InstanceType<typeof Category>> {
    try {
      return await Category.create<InstanceType<typeof Category>>({ ...category });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns Category
   */
  async findById(id: string): Promise<InstanceType<typeof Category> | null> {
    try {
      const categoryItem = await Category.findByPk(id, {
        include: [
          {
            model: Post,
            as: "posts", // Use the alias defined in associations
          },
        ],
      });

      if (!categoryItem) {
        throw new NotFoundException("Category", id);
      }
      return categoryItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @name
   * returns Category
   */
  async findByName(name: string): Promise<InstanceType<typeof Category> | null> {
    try {
      const categoryItem = await Category.findOne({
        where: { name },
        include: [
          {
            model: Post,
            as: "posts", // Use the alias defined in associations
          },
        ],
      });
      return categoryItem;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Returns an array of Category
   */
  async getAll(): Promise<InstanceType<typeof Category>[]> {
    try {
      const categories = await Category.findAll({
        include: [
          {
            model: Post,
            as: "posts", // Use the alias defined in associations
          },
        ],
      });
      return categories;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a Category as parameter
   * @category
   * returns void
   */
  async update(category: ICategory): Promise<InstanceType<typeof Category>> {
    const { id } = category;
    try {
      const categoryItem: any = await Category.findByPk(id);

      if (!categoryItem) {
        throw new NotFoundException("Category", id.toString());
      }

      return await categoryItem?.update({ ...category });
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
      const categoryItem = await Category.findByPk(id);

      if (!categoryItem) {
        throw new NotFoundException("Category", id);
      }

      await categoryItem?.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }
}

