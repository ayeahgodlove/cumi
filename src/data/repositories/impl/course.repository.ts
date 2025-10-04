import { ICourse } from "@domain/models/course";
import { ICourseRepository } from "../contracts/repository.base";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { ICategory } from "@domain/models/category";
import { Course, Category} from "../../entities/index";
export class CourseRepository implements ICourseRepository {
  /**
   *
   */
  constructor() {}

  /**
   * Receives a Course as parameter
   * @course
   * returns void
   */
  async create(course: ICourse): Promise<InstanceType<typeof Course>> {
    try {
      return await Course.create<InstanceType<typeof Course>>({ ...course });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns Course
   */
  async findById(id: string): Promise<InstanceType<typeof Course> | null> {
    try {
      const courseItem = await Course.findByPk(id);

      if (!courseItem) {
        throw new NotFoundException("Course", id);
      }
      return courseItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @name
   * returns Course
   */
  async findByTitle(title: string): Promise<InstanceType<typeof Course> | null> {
    try {
      const courseItem = await Course.findOne({ where: { title } });
      return courseItem;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<InstanceType<typeof Course> | null> {
    try {
      const course = await Course.findOne({
        where: { slug },
        include: [{ 
          model: Category, 
          as: "category",
          required: false // Make it optional so it doesn't fail if category doesn't exist
        }],
      });
      return course;
    } catch (error) {
      throw error;
    }
  }

  async findByCategory(category: string): Promise<InstanceType<typeof Course>[] | null> {
    try {
      const categoryItem = await Category.findOne({
        where: { slug: category },
      });

      if (!categoryItem) {
        throw new Error("Category does not exists!");
      }
      const item = categoryItem.toJSON<ICategory>();

      const courses = await Course.findAll({
        where: { categoryId: item.id },
        include: [{ model: Category, as: "category" }],
      });
      return courses;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Returns an array of Course
   */
  async getAll(): Promise<InstanceType<typeof Course>[]> {
    try {
      const categories = await Course.findAll();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a Course as parameter
   * @course
   * returns void
   */
  async update(course: ICourse): Promise<InstanceType<typeof Course>> {
    const { id } = course;
    try {
      const courseItem: any = await Course.findByPk(id);

      if (!courseItem) {
        throw new NotFoundException("Course", id.toString());
      }

      return await courseItem.update({ ...course });
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
      const courseItem = await Course.findByPk(id);

      if (!courseItem) {
        throw new NotFoundException("Course", id);
      }

      await courseItem.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }
}

