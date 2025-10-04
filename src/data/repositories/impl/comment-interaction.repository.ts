import { ICommentInteraction, ICommentInteractionStats } from "@domain/models/comment-interaction.model";
import { NotFoundException } from "../../../shared/exceptions/not-found.exception";
import { ICommentInteractionRepository } from "../comment-interaction.repository";
import { CommentInteraction, User } from "../../entities/index";
import { nanoid } from "nanoid";

export class CommentInteractionRepository implements ICommentInteractionRepository {
  constructor() {}

  async create(interaction: any, userId: string): Promise<ICommentInteraction> {
    try {
      const id = nanoid(10);
      
      const createdInteraction = await CommentInteraction.create<InstanceType<typeof CommentInteraction>>({
        id,
        ...interaction,
        userId,
      });
      return this.mapToDomain(createdInteraction);
    } catch (error) {
      throw error;
    }
  }

  async findByCommentId(commentId: string): Promise<ICommentInteraction[]> {
    try {
      const interactions = await CommentInteraction.findAll({
        where: { commentId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "fullname", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return interactions.map(interaction => this.mapToDomain(interaction));
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<ICommentInteraction[]> {
    try {
      const interactions = await CommentInteraction.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });
      return interactions.map(interaction => this.mapToDomain(interaction));
    } catch (error) {
      throw error;
    }
  }

  async findByCommentAndUser(commentId: string, userId: string): Promise<ICommentInteraction | null> {
    try {
      const interaction = await CommentInteraction.findOne({
        where: { commentId, userId },
      });
      return interaction ? this.mapToDomain(interaction) : null;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<ICommentInteraction[]> {
    try {
      const interactions = await CommentInteraction.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "fullname", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return interactions.map(interaction => this.mapToDomain(interaction));
    } catch (error) {
      throw error;
    }
  }

  async getCommentStats(commentId: string, userId?: string): Promise<ICommentInteractionStats> {
    try {
      const likesCount = await CommentInteraction.count({
        where: { commentId, interactionType: 'like' },
      });

      const dislikesCount = await CommentInteraction.count({
        where: { commentId, interactionType: 'dislike' },
      });

      let userInteraction: 'like' | 'dislike' | null = null;
      if (userId) {
        const userInteractionRecord = await CommentInteraction.findOne({
          where: { commentId, userId },
        }) as any;
        userInteraction = userInteractionRecord?.interactionType || null;
      }

      return {
        commentId,
        likesCount,
        dislikesCount,
        userInteraction,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(commentId: string, userId: string, interactionType: 'like' | 'dislike'): Promise<ICommentInteraction | null> {
    try {
      const [affectedRows] = await CommentInteraction.update(
        {
          interactionType,
          updatedAt: new Date(),
        },
        { where: { commentId, userId } }
      );

      if (affectedRows === 0) return null;

      const updatedInteraction = await this.findByCommentAndUser(commentId, userId);
      return updatedInteraction;
    } catch (error) {
      throw error;
    }
  }

  async delete(commentId: string, userId: string): Promise<boolean> {
    try {
      const deletedRows = await CommentInteraction.destroy({
        where: { commentId, userId },
      });
      return deletedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  async deleteByCommentId(commentId: string): Promise<boolean> {
    try {
      const deletedRows = await CommentInteraction.destroy({
        where: { commentId },
      });
      return deletedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  private mapToDomain(interaction: any): ICommentInteraction {
    return {
      id: interaction.id,
      commentId: interaction.commentId,
      userId: interaction.userId,
      interactionType: interaction.interactionType,
      createdAt: interaction.createdAt,
      updatedAt: interaction.updatedAt,
    };
  }
}

