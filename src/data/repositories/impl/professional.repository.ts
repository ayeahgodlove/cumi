import { IProfessional } from "@domain/models/professional.model";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { Professional } from "../../entities/index";

export class ProfessionalRepository {
  constructor() {}

  async create(professional: IProfessional): Promise<InstanceType<typeof Professional>> {
    try {
      return await Professional.create<InstanceType<typeof Professional>>({ ...professional });
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<InstanceType<typeof Professional> | null> {
    try {
      return await Professional.findByPk<InstanceType<typeof Professional>>(id);
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<InstanceType<typeof Professional>[]> {
    try {
      return await Professional.findAll<InstanceType<typeof Professional>>();
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, professional: IProfessional): Promise<InstanceType<typeof Professional> | null> {
    try {
      const existingProfessional = await Professional.findByPk<InstanceType<typeof Professional>>(id);
      if (!existingProfessional) {
        throw new NotFoundException("Professional", id);
      }
      await existingProfessional.update({ ...professional });
      return existingProfessional;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const professional = await Professional.findByPk<InstanceType<typeof Professional>>(id);
      if (!professional) {
        throw new NotFoundException("Professional", id);
      }
      await professional.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getProfessionalByEmail(email: string): Promise<IProfessional | null> {
    try {
      const professional = await Professional.findOne({
        where: { email },
      });
      return professional ? (professional as any).dataValues : null;
    } catch (error) {
      throw error;
    }
  }

  async getActiveProfessionals(): Promise<IProfessional[]> {
    try {
      const professionals = await Professional.findAll({
        where: { isActive: true },
        order: [['createdAt', 'DESC']],
      });
      return professionals.map((professional: any) => professional.dataValues);
    } catch (error) {
      throw error;
    }
  }

  async getVerifiedProfessionals(): Promise<IProfessional[]> {
    try {
      const professionals = await Professional.findAll({
        where: { isVerified: true, isActive: true },
        order: [['createdAt', 'DESC']],
      });
      return professionals.map((professional: any) => professional.dataValues);
    } catch (error) {
      throw error;
    }
  }

  async getProfessionalsByLocation(location: string): Promise<IProfessional[]> {
    try {
      const professionals = await Professional.findAll({
        where: { location, isActive: true },
        order: [['createdAt', 'DESC']],
      });
      return professionals.map((professional: any) => professional.dataValues);
    } catch (error) {
      throw error;
    }
  }

  async getProfessionalsBySkills(skills: string[]): Promise<IProfessional[]> {
    try {
      const professionals = await Professional.findAll({
        where: { 
          isActive: true,
          skills: {
            [require('sequelize').Op.contains]: skills
          }
        },
        order: [['createdAt', 'DESC']],
      });
      return professionals.map((professional: any) => professional.dataValues);
    } catch (error) {
      throw error;
    }
  }

  async getProfessionalsByExperience(minYears: number, maxYears?: number): Promise<IProfessional[]> {
    try {
      const whereClause: any = { 
        isActive: true,
        yearsOfExperience: {
          [require('sequelize').Op.gte]: minYears
        }
      };

      if (maxYears) {
        whereClause.yearsOfExperience[require('sequelize').Op.lte] = maxYears;
      }

      const professionals = await Professional.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
      });
      return professionals.map((professional: any) => professional.dataValues);
    } catch (error) {
      throw error;
    }
  }

  async getProfessionalsByAvailability(availability: string): Promise<IProfessional[]> {
    try {
      const professionals = await Professional.findAll({
        where: { availability, isActive: true },
        order: [['createdAt', 'DESC']],
      });
      return professionals.map((professional: any) => professional.dataValues);
    } catch (error) {
      throw error;
    }
  }
}
