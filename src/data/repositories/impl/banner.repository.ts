import { IBanner } from "@domain/models/banner.model";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { IBannerRepository } from "../contracts/repository.base";
import { Banner } from "../../entities/index";

export class BannerRepository implements IBannerRepository {
  constructor() {}

  /**
   * Receives a Banner as parameter
   * @banner
   * returns void
   */
  async create(banner: IBanner): Promise<InstanceType<typeof Banner>> {
    try {
      return await Banner.create<InstanceType<typeof Banner>>({ ...banner });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns Banner
   */
  async findById(id: string): Promise<InstanceType<typeof Banner> | null> {
    try {
      const bannerItem = await Banner.findByPk(id);

      if (!bannerItem) {
        throw new NotFoundException("Banner", id);
      }
      return bannerItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @title
   * returns Banner
   */
  async findByTitle(title: string): Promise<InstanceType<typeof Banner> | null> {
    try {
      const bannerItem = await Banner.findOne({ where: { title } });
      return bannerItem;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Returns an array of Banner
   */
  async getAll(): Promise<InstanceType<typeof Banner>[]> {
    try {
      const categories = await Banner.findAll();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a Banner as parameter
   * @banner
   * returns void
   */
  async update(banner: IBanner): Promise<InstanceType<typeof Banner>> {
    const { id } = banner;
    try {
      const bannerItem: any = await Banner.findByPk(id);

      if (!bannerItem) {
        throw new NotFoundException("Banner", id.toString());
      }

      return await bannerItem?.update({ ...banner });
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
      const bannerItem = await Banner.findByPk(id);

      if (!bannerItem) {
        throw new NotFoundException("Banner", id);
      }

      await bannerItem?.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
