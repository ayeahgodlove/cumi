import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { IRoleRepository } from "../contracts/repository.base";
import { IRole } from "@domain/models/role.model";
import { Role } from "../../entities/index";
export class RoleRepository implements IRoleRepository {
  /**
   *
   */
  constructor() {}

  /**
   * Receives a Role as parameter
   * @role
   * returns void
   */
  async create(role: IRole): Promise<InstanceType<typeof Role>> {
    try {
      return await Role.create<InstanceType<typeof Role>>({ ...role });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns Role
   */
  async findById(id: string): Promise<InstanceType<typeof Role> | null> {
    try {
      const roleItem = await Role.findByPk(id);

      if (!roleItem) {
        throw new NotFoundException("Role", id);
      }
      return roleItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @name
   * returns Role
   */
  async findByName(name: string): Promise<InstanceType<typeof Role> | null> {
    try {
      const roleItem = await Role.findOne({ where: { name } });
      return roleItem;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Returns an array of Role
   */
  async getAll(): Promise<InstanceType<typeof Role>[]> {
    try {
      const roles = await Role.findAll();
      return roles;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a Role as parameter
   * @role
   * returns void
   */
  async update(role: IRole): Promise<InstanceType<typeof Role>> {
    const { id } = role;
    try {
      const roleItem: any = await Role.findByPk(id);

      if (!roleItem) {
        throw new NotFoundException("Role", id.toString());
      }

      return await roleItem?.update({ ...role });
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
      const roleItem = await Role.findByPk(id);

      if (!roleItem) {
        throw new NotFoundException("Role", id);
      }

      await roleItem?.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
