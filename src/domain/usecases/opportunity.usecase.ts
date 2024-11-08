import Opportunity from "@data/entities/opportunity";
import { IOpportunityRepository } from "@data/repositories/contracts/repository.base";
import { IOpportunity } from "@domain/models/opportunity.model";
import slugify from "slugify";

export class OpportunityUseCase {
  /**
   *
   */
  constructor(private readonly opportunityRepository: IOpportunityRepository) {}

  async createOpportunity(opportunity: IOpportunity): Promise<Opportunity> {
    const existingOpportunity = await this.opportunityRepository.findByTitle(opportunity.title);

    if (existingOpportunity) {
      throw new Error("Opportunity already exists");
    }
    return this.opportunityRepository.create(opportunity);
  }

  async getAll(): Promise<Opportunity[]> {
    return this.opportunityRepository.getAll();
  }

  async getOpportunityById(id: string): Promise<Opportunity | null> {
    return this.opportunityRepository.findById(id);
  }

  async getOpportunityBySlug(slug: string): Promise<Opportunity | null> {
    return this.opportunityRepository.findBySlug(slug);
  }

  async updateOpportunity(opportunity: IOpportunity): Promise<Opportunity> {
    const obj: IOpportunity = {
      ...opportunity,
      slug: slugify(opportunity.title, { lower: true, replacement: "-" }),
    };
    return this.opportunityRepository.update(obj);
  }

  async deleteOpportunity(id: string): Promise<void> {
    return this.opportunityRepository.delete(id);
  }
}
