import { ILesson } from "@domain/models/lesson";
import { ILessonRepository } from "../contracts/repository.base";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { Lesson } from "../../entities/index";

export class LessonRepository implements ILessonRepository {
  /**
   *
   */
  constructor() {}

  /**
   * Receives a Lesson as parameter
   * @lesson
   * returns void
   */
  async create(lesson: ILesson): Promise<InstanceType<typeof Lesson>> {
    try {
      return await Lesson.create<InstanceType<typeof Lesson>>({ ...lesson });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns Lesson
   */
  async findById(id: string): Promise<InstanceType<typeof Lesson> | null> {
    try {
      const lessonItem = await Lesson.findByPk(id);

      if (!lessonItem) {
        throw new NotFoundException("Lesson", id);
      }
      return lessonItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @name
   * returns Lesson
   */
  async findByTitle(title: string): Promise<InstanceType<typeof Lesson> | null> {
    try {
      const lessonItem = await Lesson.findOne({ where: { title } });
      return lessonItem;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<InstanceType<typeof Lesson> | null> {
    try {
      const lesson = await Lesson.findOne({
        where: { slug },
      });
      return lesson;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Returns an array of Lesson
   */
  async getAll(): Promise<InstanceType<typeof Lesson>[]> {
    try {
      const categories = await Lesson.findAll();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a Lesson as parameter
   * @lesson
   * returns void
   */
  async update(lesson: ILesson): Promise<InstanceType<typeof Lesson>> {
    const { id } = lesson;
    try {
      const lessonItem: any = await Lesson.findByPk(id);

      if (!lessonItem) {
        throw new NotFoundException("Lesson", id.toString());
      }

      return await lessonItem.update({ ...lesson });
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
      const lessonItem = await Lesson.findByPk(id);

      if (!lessonItem) {
        throw new NotFoundException("Lesson", id);
      }

      await lessonItem.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
