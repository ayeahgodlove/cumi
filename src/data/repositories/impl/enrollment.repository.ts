import { IEnrollment } from "@domain/models/enrollment";
import { IRepository } from "../contracts/repository.base";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { Enrollment } from "../../entities/index";

export class EnrollmentRepository
  implements IRepository<IEnrollment, InstanceType<typeof Enrollment>>
{
  /**
   *
   */
  constructor() {}

  /**
   * Receives a Enrollment as parameter
   * @enrollment
   * returns void
   */
  async create(
    enrollment: IEnrollment
  ): Promise<InstanceType<typeof Enrollment>> {
    try {
      return await Enrollment.create<InstanceType<typeof Enrollment>>({
        ...enrollment,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns Enrollment
   */
  async findById(id: string): Promise<InstanceType<typeof Enrollment> | null> {
    try {
      const enrollmentItem = await Enrollment.findByPk(id);

      if (!enrollmentItem) {
        throw new NotFoundException("Enrollment", id);
      }
      return enrollmentItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @name
   * returns Enrollment
   */
  async findByName(
    queryId: string
  ): Promise<InstanceType<typeof Enrollment> | null> {
    try {
      const enrollmentItem = await Enrollment.findOne({
        where: { userId: queryId },
      });
      return enrollmentItem;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Returns an array of Enrollment
   */
  async getAll(): Promise<InstanceType<typeof Enrollment>[]> {
    try {
      const categories = await Enrollment.findAll();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a Enrollment as parameter
   * @enrollment
   * returns void
   */
  async update(
    enrollment: IEnrollment
  ): Promise<InstanceType<typeof Enrollment>> {
    const { id } = enrollment;
    try {
      const enrollmentItem: any = await Enrollment.findByPk(id);

      if (!enrollmentItem) {
        throw new NotFoundException("Enrollment", id.toString());
      }

      return await enrollmentItem.update({ ...enrollment });
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
      const enrollmentItem = await Enrollment.findByPk(id);

      if (!enrollmentItem) {
        throw new NotFoundException("Enrollment", id);
      }

      await enrollmentItem.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
