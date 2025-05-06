import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { IOpportunityRepository } from "../contracts/repository.base";
import { IOpportunity } from "@domain/models/opportunity.model";
import sequelize from "@database/db-sequelize.config";
import { Opportunity } from "../../entities/index";

export class OpportunityRepository implements IOpportunityRepository {
  /**
   *
   */
  constructor() {}

  /**
   * Receives a String as parameter
   * @title
   * returns Category
   */
  async findByTitle(
    title: string
  ): Promise<InstanceType<typeof Opportunity> | null> {
    try {
      const opportunity = await Opportunity.findOne({ where: { title } });
      return opportunity;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(
    slug: string
  ): Promise<InstanceType<typeof Opportunity> | null> {
    try {
      const opportunity = await Opportunity.findOne({ where: { slug } });
      return opportunity;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a Opportunity as parameter
   * @opportunity
   * returns void
   */
  async create(
    opportunity: IOpportunity
  ): Promise<InstanceType<typeof Opportunity>> {
    // Begin transaction if needed
    const transaction = await sequelize.transaction();
    try {
      const opportunityItem = await Opportunity.create<
        InstanceType<typeof Opportunity>
      >({ ...opportunity }, { transaction });

      // Commit transaction
      await transaction.commit();

      return opportunityItem;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns Opportunity
   */
  async findById(id: string): Promise<InstanceType<typeof Opportunity> | null> {
    try {
      const opportunityItem = await Opportunity.findByPk(id);

      if (!opportunityItem) {
        throw new NotFoundException("Opportunity", id);
      }
      return opportunityItem;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Returns an array of Opportunity
   */
  async getAll(): Promise<InstanceType<typeof Opportunity>[]> {
    try {
      const categories = await Opportunity.findAll();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a Opportunity as parameter
   * @opportunity
   * returns void
   */
  async update(
    opportunity: IOpportunity
  ): Promise<InstanceType<typeof Opportunity>> {
    const { id } = opportunity;
    try {
      const opportunityItem: any = await Opportunity.findByPk(id);

      if (!opportunityItem) {
        throw new NotFoundException("Opportunity", id.toString());
      }

      return await opportunityItem?.update({ ...opportunity });
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
      const opportunityItem = await Opportunity.findByPk(id);

      if (!opportunityItem) {
        throw new NotFoundException("Opportunity", id);
      }

      await opportunityItem?.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
