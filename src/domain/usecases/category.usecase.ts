import { Category } from "@data/entities/index";
import slugify from "slugify";
import { ICategory } from "@domain/models/category";
import { ICategoryRepository } from "@data/repositories/contracts/repository.base";

export class CategoryUseCase {
  /**
   *
   */
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async createCategory(category: ICategory): Promise<InstanceType<typeof Category>> {
    const existingCategory = await this.categoryRepository.findByName(
      category.name
    );

    if (existingCategory) {
      throw new Error("Category already exists");
    }

    // const _category = new Category({category});
    //because it's already done in the Repository
    return this.categoryRepository.create(category);
  }

  async getAll(): Promise<InstanceType<typeof Category>[]> {
    return this.categoryRepository.getAll();
  }

  async getCategoryById(id: string): Promise<InstanceType<typeof Category> | null> {
    return this.categoryRepository.findById(id);
  }

  async updateCategory(category: ICategory): Promise<InstanceType<typeof Category>> {
    const { id, name } = category;
    const obj: ICategory = {
      id,
      name,
      slug: slugify(name, { lower: true, replacement: "-" }),
    };
    return this.categoryRepository.update(obj);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.categoryRepository.delete(id);
  }
}
