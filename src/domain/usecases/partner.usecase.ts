import { IPartner } from "@domain/models/partner.model";
import { PartnerRepository } from "@data/repositories/impl/partner.repository";

export class PartnerUseCase {
  constructor(private partnerRepository: PartnerRepository) {}

  async getAll(): Promise<IPartner[]> {
    const partners = await this.partnerRepository.getAll();
    return partners.map((partner: any) => partner.dataValues || partner);
  }

  async getById(id: string): Promise<IPartner | null> {
    const partner = await this.partnerRepository.findById(id);
    return partner ? (partner as any).dataValues || partner : null;
  }

  async getPartnersByLocation(location: string): Promise<IPartner[]> {
    return await this.partnerRepository.getPartnersByLocation(location);
  }

  async create(partner: IPartner): Promise<IPartner> {
    const createdPartner = await this.partnerRepository.create(partner);
    return (createdPartner as any).dataValues || createdPartner;
  }

  async update(id: string, partner: IPartner): Promise<IPartner | null> {
    const updatedPartner = await this.partnerRepository.update(id, partner);
    return updatedPartner ? (updatedPartner as any).dataValues || updatedPartner : null;
  }

  async delete(id: string): Promise<boolean> {
    return await this.partnerRepository.delete(id);
  }
}

