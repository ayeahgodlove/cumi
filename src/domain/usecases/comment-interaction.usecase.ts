import { ICommentInteraction, ICommentInteractionStats } from "../../domain/models/comment-interaction.model";
import { ICommentInteractionRepository } from "../../data/repositories/comment-interaction.repository";

export class CommentInteractionUseCase {
  constructor(private commentInteractionRepository: ICommentInteractionRepository) {}

  async likeComment(commentId: string, userId: string): Promise<ICommentInteractionStats> {
    // Check if user already has an interaction with this comment
    const existingInteraction = await this.commentInteractionRepository.findByCommentAndUser(commentId, userId);
    
    if (existingInteraction) {
      if (existingInteraction.interactionType === 'like') {
        // User already liked, remove the like
        await this.commentInteractionRepository.delete(commentId, userId);
      } else {
        // User disliked, change to like
        await this.commentInteractionRepository.update(commentId, userId, 'like');
      }
    } else {
      // No existing interaction, create a new like
      await this.commentInteractionRepository.create({
        commentId,
        interactionType: 'like',
      }, userId);
    }

    return this.commentInteractionRepository.getCommentStats(commentId, userId);
  }

  async dislikeComment(commentId: string, userId: string): Promise<ICommentInteractionStats> {
    // Check if user already has an interaction with this comment
    const existingInteraction = await this.commentInteractionRepository.findByCommentAndUser(commentId, userId);
    
    if (existingInteraction) {
      if (existingInteraction.interactionType === 'dislike') {
        // User already disliked, remove the dislike
        await this.commentInteractionRepository.delete(commentId, userId);
      } else {
        // User liked, change to dislike
        await this.commentInteractionRepository.update(commentId, userId, 'dislike');
      }
    } else {
      // No existing interaction, create a new dislike
      await this.commentInteractionRepository.create({
        commentId,
        interactionType: 'dislike',
      }, userId);
    }

    return this.commentInteractionRepository.getCommentStats(commentId, userId);
  }

  async getCommentStats(commentId: string, userId?: string): Promise<ICommentInteractionStats> {
    return this.commentInteractionRepository.getCommentStats(commentId, userId);
  }

  async getUserInteractions(userId: string): Promise<ICommentInteraction[]> {
    return this.commentInteractionRepository.findByUserId(userId);
  }

  async handleInteraction(commentId: string, action: 'like' | 'dislike', userId: string): Promise<ICommentInteractionStats> {
    // Check if user already has an interaction with this comment
    const existingInteraction = await this.commentInteractionRepository.findByCommentAndUser(commentId, userId);
    
    if (existingInteraction) {
      if (existingInteraction.interactionType === action) {
        // User is trying to perform the same action, remove the interaction
        await this.commentInteractionRepository.delete(commentId, userId);
      } else {
        // User is changing their interaction, update it
        await this.commentInteractionRepository.update(commentId, userId, action);
      }
    } else {
      // User doesn't have an interaction, create a new one
      await this.commentInteractionRepository.create({ commentId, interactionType: action }, userId);
    }

    // Return updated stats
    return this.commentInteractionRepository.getCommentStats(commentId, userId);
  }
}
