import Media from "@data/entities/media";
import { IMediaRepository } from "@data/repositories/contracts/repository.base";
import { IMedia } from "@domain/models/media.model";

export class MediaUseCase {
  /**
   *
   */
  constructor(private readonly mediaRepository: IMediaRepository) {}

  async createMedia(media: IMedia): Promise<Media> {
    const existingMedia = await this.mediaRepository.findByTitle(
      media.title
    );

    if (existingMedia) {
      throw new Error("Media already exists");
    }

    // const _media = new Media({media});
    //because it's already done in the Repository
    return this.mediaRepository.create(media);
  }

  async getAll(): Promise<Media[]> {
    return this.mediaRepository.getAll();
  }

  async getMediaById(id: string): Promise<Media | null> {
    return this.mediaRepository.findById(id);
  }

  async updateMedia(media: IMedia): Promise<Media> {
    return this.mediaRepository.update(media);
  }

  async deleteMedia(id: string): Promise<void> {
    return this.mediaRepository.delete(id);
  }
}
