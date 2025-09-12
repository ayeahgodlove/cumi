import { IComment } from "../../domain/models/comment.model";
import { CommentRequestDto } from "../dtos/comment-request.dto";

export interface ICommentRepository {
  create(comment: CommentRequestDto, userId: string): Promise<IComment>;
  findById(id: string): Promise<IComment | null>;
  findByPostId(postId: string): Promise<IComment[]>;
  findByUserId(userId: string): Promise<IComment[]>;
  update(id: string, comment: Partial<CommentRequestDto>): Promise<IComment | null>;
  delete(id: string): Promise<boolean>;
  findRecentComments(limit?: number): Promise<IComment[]>;
  findCommentsByUser(userId: string, limit?: number): Promise<IComment[]>;
}
