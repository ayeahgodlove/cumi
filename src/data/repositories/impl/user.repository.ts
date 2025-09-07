import { IUser } from "@domain/models/user";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { IUserRepository } from "../contracts/repository.base";
import bcrypt from "bcrypt";
import { User } from "../../entities/index";

export class UserRepository implements IUserRepository {
  /**
   *
   */
  constructor() {}

  /**
   * Receives a User as parameter
   * @user
   * returns void
   */
  async create(user: IUser): Promise<InstanceType<typeof User>> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    user.authStrategy = "local-auth";
    // user.phoneNumber = user.whatsappNumber

    try {
      return await User.create<InstanceType<typeof User>>(user as any);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns User
   */
  async findById(id: string): Promise<InstanceType<typeof User> | null> {
    try {
      const userItem = await User.findByPk(id);

      if (!userItem) {
        throw new NotFoundException("User", id);
      }
      return userItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @name
   * returns User
   */
  async findByUsername(
    name: string
  ): Promise<InstanceType<typeof User> | null> {
    try {
      const userItem = await User.findOne({ where: { username: name } });
      return userItem;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Returns an array of User
   */
  async getAll(): Promise<InstanceType<typeof User>[]> {
    try {
      const users = await User.findAll();
      return users;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a User as parameter
   * @user
   * returns void
   */
  async update(user: IUser): Promise<InstanceType<typeof User>> {
    const { id } = user;
    try {
      const userItem: any = await User.findByPk(id);

      if (!userItem) {
        throw new NotFoundException("User", id.toString());
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      return await userItem?.update({ ...user });
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
      const userItem = await User.findByPk(id);

      if (!userItem) {
        throw new NotFoundException("User", id);
      }

      await userItem?.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
