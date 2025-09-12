import { ICommentInteraction, ICommentInteractionStats } from "@domain/models/comment-interaction.model";

export interface ICommentInteractionRepository {
  create(interaction: any, userId: string): Promise<ICommentInteraction>;
  findByCommentId(commentId: string): Promise<ICommentInteraction[]>;
  findByUserId(userId: string): Promise<ICommentInteraction[]>;
  findByCommentAndUser(commentId: string, userId: string): Promise<ICommentInteraction | null>;
  getCommentStats(commentId: string, userId?: string): Promise<ICommentInteractionStats>;
  update(commentId: string, userId: string, interactionType: 'like' | 'dislike'): Promise<ICommentInteraction | null>;
  delete(commentId: string, userId: string): Promise<boolean>;
  deleteByCommentId(commentId: string): Promise<boolean>;
}
