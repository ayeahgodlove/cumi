import { IPostInteraction, IPostInteractionStats } from "@domain/models/post-interaction.model";
import { IPostInteractionRepository } from "@data/repositories/post-interaction.repository";

export class PostInteractionUseCase {
  constructor(private postInteractionRepository: IPostInteractionRepository) {}

  async handleInteraction(postId: string, action: 'like' | 'dislike', userId: string): Promise<IPostInteractionStats> {
    // Check if user already has an interaction with this post
    const existingInteraction = await this.postInteractionRepository.findByPostAndUser(postId, userId);

    if (existingInteraction) {
      if (existingInteraction.action === action) {
        // User is trying to perform the same action, prevent duplicate
        throw new Error(`You have already ${action}d this post`);
      } else {
        // User is changing their interaction, update it
        await this.postInteractionRepository.update(existingInteraction.id, { action });
      }
    } else {
      // User doesn't have an interaction, create a new one
      await this.postInteractionRepository.create({ postId, action }, userId);
    }

    // Return updated stats
    return this.postInteractionRepository.getStats(postId, userId);
  }

  async getPostStats(postId: string, userId?: string): Promise<IPostInteractionStats> {
    return this.postInteractionRepository.getStats(postId, userId);
  }

  async getUserInteractions(userId: string): Promise<IPostInteraction[]> {
    return this.postInteractionRepository.findByUserId(userId);
  }

  async getPostInteractions(postId: string): Promise<IPostInteraction[]> {
    return this.postInteractionRepository.findByPostId(postId);
  }
}
