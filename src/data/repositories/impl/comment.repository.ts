import { IComment } from "@domain/models/comment.model";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { ICommentRepository } from "../comment.repository";
import { Comment, User, Post } from "../../entities/index";

export class CommentRepository implements ICommentRepository {
  constructor() {}

  async create(comment: any, userId: string): Promise<IComment> {
    try {
      const createdComment = await Comment.create<InstanceType<typeof Comment>>({
        ...comment,
        userId,
      });
      return this.mapToDomain(createdComment);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<IComment | null> {
    try {
      const comment = await Comment.findByPk(id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "fullname", "email"],
          },
          {
            model: Post,
            as: "post",
            attributes: ["id", "title", "slug"],
          },
        ],
      });
      return comment ? this.mapToDomain(comment) : null;
    } catch (error) {
      throw error;
    }
  }

  async findByPostId(postId: string): Promise<IComment[]> {
    try {
      const comments = await Comment.findAll({
        where: { postId, isApproved: true, parentId: null },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "fullname", "email"],
          },
          {
            model: Comment,
            as: "replies",
            where: { isApproved: true },
            required: false,
            include: [
              {
                model: User,
                as: "user",
                attributes: ["id", "username", "fullname", "email"],
              },
            ],
            order: [["createdAt", "ASC"]],
          },
        ],
        order: [["createdAt", "ASC"]],
      });
      return comments.map(comment => this.mapToDomain(comment));
    } catch (error) {
      console.error("Error in findByPostId:", error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<IComment[]> {
    try {
      const comments = await Comment.findAll({
        where: { userId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "fullname", "email"],
          },
          {
            model: Post,
            as: "post",
            attributes: ["id", "title", "slug"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return comments.map(comment => this.mapToDomain(comment));
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<IComment[]> {
    try {
      const comments = await Comment.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "fullname", "email"],
          },
          {
            model: Post,
            as: "post",
            attributes: ["id", "title", "slug"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return comments.map(comment => this.mapToDomain(comment));
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, comment: any): Promise<IComment | null> {
    try {
      const [affectedRows] = await Comment.update(
        {
          content: comment.content,
          isApproved: comment.isApproved,
          updatedAt: new Date(),
        },
        { where: { id } }
      );

      if (affectedRows === 0) return null;

      const updatedComment = await this.findById(id);
      return updatedComment;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deletedRows = await Comment.destroy({ where: { id } });
      return deletedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  async findRecentComments(limit: number = 10): Promise<IComment[]> {
    try {
      const comments = await Comment.findAll({
        where: { isApproved: true },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "fullname", "email"],
          },
          {
            model: Post,
            as: "post",
            attributes: ["id", "title", "slug"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
      });
      return comments.map(comment => this.mapToDomain(comment));
    } catch (error) {
      throw error;
    }
  }

  async findCommentsByUser(userId: string, limit: number = 10): Promise<IComment[]> {
    try {
      const comments = await Comment.findAll({
        where: { userId, isApproved: true },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "fullname", "email"],
          },
          {
            model: Post,
            as: "post",
            attributes: ["id", "title", "slug"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
      });
      return comments.map(comment => this.mapToDomain(comment));
    } catch (error) {
      throw error;
    }
  }

  private mapToDomain(comment: any): IComment {
    return {
      id: comment.id,
      content: comment.content,
      postId: comment.postId,
      userId: comment.userId,
      parentId: comment.parentId,
      isApproved: comment.isApproved,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: comment.user ? {
        id: comment.user.id,
        name: comment.user.fullname || comment.user.username,
        email: comment.user.email,
        image: undefined, // Image field not available in users table
      } : undefined,
      post: comment.post ? {
        id: comment.post.id,
        title: comment.post.title,
        slug: comment.post.slug,
      } : undefined,
      replies: comment.replies ? comment.replies.map((reply: any) => this.mapToDomain(reply)) : undefined,
    };
  }
}
