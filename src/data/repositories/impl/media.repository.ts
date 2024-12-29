import { IMedia } from "@domain/models/media.model";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { IMediaRepository } from "../contracts/repository.base";
import Media from "@data/entities/media";
export class MediaRepository implements IMediaRepository {
  constructor() {}

  /**
   * Receives a Media as parameter
   * @media
   * returns void
   */
  async create(media: IMedia): Promise<Media> {
    try {
      return await Media.create<Media>({ ...media });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @id
   * returns Media
   */
  async findById(id: string): Promise<Media | null> {
    try {
      const mediaItem = await Media.findByPk(id);

      if (!mediaItem) {
        throw new NotFoundException("Media", id);
      }
      return mediaItem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a String as parameter
   * @title
   * returns Media
   */
  async findByTitle(title: string): Promise<Media | null> {
    try {
      const mediaItem = await Media.findOne({ where: { title } });
      return mediaItem;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<Media | null> {
    try {
      const mediaItem = await Media.findOne({ where: { slug } });
      return mediaItem;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Returns an array of Media
   */
  async getAll(): Promise<Media[]> {
    try {
      const mediaItems = await Media.findAll();
      return mediaItems;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Receives a Media as parameter
   * @media
   * returns void
   */
  async update(media: IMedia): Promise<Media> {
    const { id } = media;
    try {
      const mediaItem: any = await Media.findByPk(id);

      if (!mediaItem) {
        throw new NotFoundException("Media", id.toString());
      }

      return await mediaItem?.update({ ...media });
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
      const mediaItem = await Media.findByPk(id);

      if (!mediaItem) {
        throw new NotFoundException("Media", id);
      }

      await mediaItem?.destroy({
        force: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
