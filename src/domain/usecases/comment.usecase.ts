import { IComment } from "../../domain/models/comment.model";
import { ICommentRepository } from "../../data/repositories/comment.repository";
import { CommentRequestDto } from "../../presentation/dtos/comment-request.dto";

export class CommentUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  async createComment(comment: any, userId: string): Promise<IComment> {
    // Validate comment content
    if (!comment.content || comment.content.trim().length === 0) {
      throw new Error("Comment content cannot be empty");
    }

    if (comment.content.length > 1000) {
      throw new Error("Comment content cannot exceed 1000 characters");
    }

    return this.commentRepository.create(comment, userId);
  }

  async getCommentsByPostId(postId: string): Promise<IComment[]> {
    return this.commentRepository.findByPostId(postId);
  }

  async getCommentsByUserId(userId: string): Promise<IComment[]> {
    return this.commentRepository.findByUserId(userId);
  }

  async getCommentById(id: string): Promise<IComment | null> {
    return this.commentRepository.findById(id);
  }

  async updateComment(id: string, comment: Partial<CommentRequestDto>, userId: string): Promise<IComment | null> {
    // Check if comment exists and belongs to user
    const existingComment = await this.commentRepository.findById(id);
    if (!existingComment) {
      throw new Error("Comment not found");
    }

    if (existingComment.userId !== userId) {
      throw new Error("You can only update your own comments");
    }

    // Validate content if provided
    if (comment.content && comment.content.trim().length === 0) {
      throw new Error("Comment content cannot be empty");
    }

    if (comment.content && comment.content.length > 1000) {
      throw new Error("Comment content cannot exceed 1000 characters");
    }

    return this.commentRepository.update(id, comment);
  }

  async deleteComment(id: string, userId: string): Promise<boolean> {
    // Check if comment exists and belongs to user
    const existingComment = await this.commentRepository.findById(id);
    if (!existingComment) {
      throw new Error("Comment not found");
    }

    if (existingComment.userId !== userId) {
      throw new Error("You can only delete your own comments");
    }

    return this.commentRepository.delete(id);
  }

  async getRecentComments(limit: number = 10): Promise<IComment[]> {
    return this.commentRepository.findRecentComments(limit);
  }

  async getCommentsByUser(userId: string, limit: number = 10): Promise<IComment[]> {
    return this.commentRepository.findCommentsByUser(userId, limit);
  }
}

