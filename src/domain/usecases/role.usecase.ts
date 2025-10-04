import { Role } from "@data/entities/index";
import { IRoleRepository } from "@data/repositories/contracts/repository.base";
import { IRole } from "@domain/models/role.model";

export class RoleUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async createRole(role: IRole): Promise<InstanceType<typeof Role>> {
    const existingRole = await this.roleRepository.findByName(role.name);

    if (existingRole) {
      throw new Error("Role already exists");
    }

    // const _role = new Role({role});
    //because it's already done in the Repository
    return this.roleRepository.create(role);
  }

  async getAll(): Promise<InstanceType<typeof Role>[]> {
    return this.roleRepository.getAll();
  }

  async getRoleById(id: string): Promise<InstanceType<typeof Role> | null> {
    return this.roleRepository.findById(id);
  }

  async updateRole(role: IRole): Promise<InstanceType<typeof Role>> {
    const obj: IRole = {
      ...role,
    };
    return this.roleRepository.update(obj);
  }

  async deleteRole(id: string): Promise<void> {
    return this.roleRepository.delete(id);
  }
}

