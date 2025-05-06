import { User } from "@data/entities/index";
import { IUserRepository } from "@data/repositories/contracts/repository.base";
import { IUser } from "@domain/models/user";

export class UserUseCase {
  /**
   *
   */
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(user: IUser): Promise<InstanceType<typeof User>> {
    const existingUser = await this.userRepository.findByName(user.username);

    if (existingUser) {
      throw new Error("User already exists");
    }

    // const _user = new User({user});
    //because it's already done in the Repository
    return this.userRepository.create(user);
  }

  async getAll(): Promise<InstanceType<typeof User>[]> {
    return this.userRepository.getAll();
  }

  async getUserById(id: string): Promise<InstanceType<typeof User> | null> {
    return this.userRepository.findById(id);
  }

  async updateUser(user: IUser): Promise<InstanceType<typeof User>> {
    const obj: IUser = {
      ...user,
    };
    return this.userRepository.update(obj);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }

}
