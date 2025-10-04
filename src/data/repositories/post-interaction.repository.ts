import { IPostInteraction, IPostInteractionStats } from "@domain/models/post-interaction.model";

export interface IPostInteractionRepository {
  create(interaction: any, userId: string): Promise<IPostInteraction>;
  findByPostId(postId: string): Promise<IPostInteraction[]>;
  findByUserId(userId: string): Promise<IPostInteraction[]>;
  findByPostAndUser(postId: string, userId: string): Promise<IPostInteraction | null>;
  update(id: string, interaction: Partial<IPostInteraction>): Promise<IPostInteraction>;
  delete(id: string): Promise<void>;
  getStats(postId: string, userId?: string): Promise<IPostInteractionStats>;
}

