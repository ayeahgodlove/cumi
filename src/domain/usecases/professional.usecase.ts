import { IProfessional } from "@domain/models/professional.model";
import { ProfessionalRepository } from "@data/repositories/impl/professional.repository";

export class ProfessionalUseCase {
  constructor(private professionalRepository: ProfessionalRepository) {}

  async getAll(): Promise<IProfessional[]> {
    const professionals = await this.professionalRepository.getAll();
    return professionals.map((professional: any) => professional.dataValues || professional);
  }

  async getById(id: string): Promise<IProfessional | null> {
    const professional = await this.professionalRepository.findById(id);
    return professional ? (professional as any).dataValues || professional : null;
  }

  async getProfessionalByEmail(email: string): Promise<IProfessional | null> {
    return await this.professionalRepository.getProfessionalByEmail(email);
  }

  async getActiveProfessionals(): Promise<IProfessional[]> {
    return await this.professionalRepository.getActiveProfessionals();
  }

  async getVerifiedProfessionals(): Promise<IProfessional[]> {
    return await this.professionalRepository.getVerifiedProfessionals();
  }

  async getProfessionalsByLocation(location: string): Promise<IProfessional[]> {
    return await this.professionalRepository.getProfessionalsByLocation(location);
  }

  async getProfessionalsBySkills(skills: string[]): Promise<IProfessional[]> {
    return await this.professionalRepository.getProfessionalsBySkills(skills);
  }

  async getProfessionalsByExperience(minYears: number, maxYears?: number): Promise<IProfessional[]> {
    return await this.professionalRepository.getProfessionalsByExperience(minYears, maxYears);
  }

  async getProfessionalsByAvailability(availability: string): Promise<IProfessional[]> {
    return await this.professionalRepository.getProfessionalsByAvailability(availability);
  }

  async create(professional: IProfessional): Promise<IProfessional> {
    const createdProfessional = await this.professionalRepository.create(professional);
    return (createdProfessional as any).dataValues || createdProfessional;
  }

  async update(id: string, professional: IProfessional): Promise<IProfessional | null> {
    const updatedProfessional = await this.professionalRepository.update(id, professional);
    return updatedProfessional ? (updatedProfessional as any).dataValues || updatedProfessional : null;
  }

  async delete(id: string): Promise<boolean> {
    return await this.professionalRepository.delete(id);
  }
}

