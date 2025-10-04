import { IPartner } from "@domain/models/partner.model";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { Partner } from "../../entities/index";

export class PartnerRepository {
  constructor() {}

  async create(partner: IPartner): Promise<InstanceType<typeof Partner>> {
    try {
      return await Partner.create<InstanceType<typeof Partner>>({ ...partner });
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<InstanceType<typeof Partner> | null> {
    try {
      return await Partner.findByPk<InstanceType<typeof Partner>>(id);
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<InstanceType<typeof Partner>[]> {
    try {
      return await Partner.findAll<InstanceType<typeof Partner>>();
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, partner: IPartner): Promise<InstanceType<typeof Partner> | null> {
    try {
      const existingPartner = await Partner.findByPk<InstanceType<typeof Partner>>(id);
      if (!existingPartner) {
        throw new NotFoundException("Partner", id);
      }
      await existingPartner.update({ ...partner });
      return existingPartner;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const partner = await Partner.findByPk<InstanceType<typeof Partner>>(id);
      if (!partner) {
        throw new NotFoundException("Partner", id);
      }
      await partner.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getPartnersByLocation(location: string): Promise<IPartner[]> {
    try {
      const partners = await Partner.findAll({
        where: { location },
        order: [['createdAt', 'DESC']],
      });
      return partners.map((partner: any) => partner.dataValues);
    } catch (error) {
      throw error;
    }
  }
}

