// src/data/repositories/impl/review.repository.ts

import { IReview } from "@domain/models/review.model";
import { IReviewRepository } from "../contracts/repository.base";
import { Review, User, Course } from "../../entities/index";
import { Op } from "sequelize";

export class ReviewRepository implements IReviewRepository {
  async create(review: IReview): Promise<InstanceType<typeof Review>> {
    try {
      return await Review.create(review as any);
    } catch (error) {
      console.error("Error creating review:", error);
      console.error("Review data that failed:", review);
      throw error;
    }
  }

  async findById(id: string): Promise<InstanceType<typeof Review> | null> {
    try {
      return await Review.findByPk(id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullname", "username", "email"],
          },
          {
            model: Course,
            as: "reviewCourse",
            attributes: ["id", "title", "slug", "imageUrl"],
          },
        ],
      });
    } catch (error) {
      console.error("Error finding review by ID:", error);
      throw error;
    }
  }

  async getAll(): Promise<InstanceType<typeof Review>[]> {
    try {
      return await Review.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullname", "username", "email"],
          },
          {
            model: Course,
            as: "reviewCourse",
            attributes: ["id", "title", "slug", "imageUrl"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error getting all reviews:", error);
      throw error;
    }
  }

  async update(review: IReview): Promise<InstanceType<typeof Review>> {
    try {
      const [updatedRowsCount] = await Review.update(review as any, {
        where: { id: review.id },
      });

      if (updatedRowsCount === 0) {
        throw new Error(`Review with id ${review.id} not found`);
      }

      const updatedReview = await this.findById(review.id);
      if (!updatedReview) {
        throw new Error(`Failed to retrieve updated review with id ${review.id}`);
      }

      return updatedReview;
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const deletedRowsCount = await Review.destroy({
        where: { id },
      });

      if (deletedRowsCount === 0) {
        throw new Error(`Review with id ${id} not found`);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  }

  async findByCourseId(courseId: string): Promise<InstanceType<typeof Review>[]> {
    try {
      return await Review.findAll({
        where: { courseId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullname", "username", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding reviews by course ID:", error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<InstanceType<typeof Review>[]> {
    try {
      return await Review.findAll({
        where: { userId },
        include: [
          {
            model: Course,
            as: "reviewCourse",
            attributes: ["id", "title", "slug", "imageUrl"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding reviews by user ID:", error);
      throw error;
    }
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<InstanceType<typeof Review> | null> {
    try {
      return await Review.findOne({
        where: { userId, courseId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullname", "username", "email"],
          },
          {
            model: Course,
            as: "reviewCourse",
            attributes: ["id", "title", "slug", "imageUrl"],
          },
        ],
      });
    } catch (error) {
      console.error("Error finding review by user and course:", error);
      throw error;
    }
  }

  async findByStatus(status: string): Promise<InstanceType<typeof Review>[]> {
    try {
      return await Review.findAll({
        where: { status },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullname", "username", "email"],
          },
          {
            model: Course,
            as: "reviewCourse",
            attributes: ["id", "title", "slug", "imageUrl"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding reviews by status:", error);
      throw error;
    }
  }

  async findByRating(rating: number): Promise<InstanceType<typeof Review>[]> {
    try {
      return await Review.findAll({
        where: { rating },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullname", "username", "email"],
          },
          {
            model: Course,
            as: "reviewCourse",
            attributes: ["id", "title", "slug", "imageUrl"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding reviews by rating:", error);
      throw error;
    }
  }

  async findApprovedByCourseId(courseId: string): Promise<InstanceType<typeof Review>[]> {
    try {
      return await Review.findAll({
        where: { 
          courseId,
          status: 'approved'
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "fullname", "username", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding approved reviews by course ID:", error);
      throw error;
    }
  }

  async updateStatus(id: string, status: string, moderatorNotes?: string): Promise<InstanceType<typeof Review> | null> {
    try {
      const updateData: any = { status };
      if (moderatorNotes) {
        updateData.moderatorNotes = moderatorNotes;
      }

      const [updatedRowsCount] = await Review.update(updateData, {
        where: { id },
      });

      if (updatedRowsCount === 0) {
        throw new Error(`Review with id ${id} not found`);
      }

      return await this.findById(id);
    } catch (error) {
      console.error("Error updating review status:", error);
      throw error;
    }
  }

  async incrementHelpfulVotes(id: string): Promise<InstanceType<typeof Review> | null> {
    try {
      const [updatedRowsCount] = await Review.update(
        {
          helpfulVotes: Review.sequelize!.literal('helpful_votes + 1'),
        },
        {
          where: { id },
        }
      );

      if (updatedRowsCount === 0) {
        throw new Error(`Review with id ${id} not found`);
      }

      return await this.findById(id);
    } catch (error) {
      console.error("Error incrementing helpful votes:", error);
      throw error;
    }
  }

  async getAverageRatingByCourseId(courseId: string): Promise<number> {
    try {
      const result = await Review.findAll({
        where: { 
          courseId,
          status: 'approved'
        },
        attributes: [
          [Review.sequelize!.fn('AVG', Review.sequelize!.col('rating')), 'averageRating']
        ],
        raw: true,
      });

      return result[0] ? parseFloat((result[0] as any).averageRating) || 0 : 0;
    } catch (error) {
      console.error("Error getting average rating:", error);
      throw error;
    }
  }

  async getReviewStatsByCourseId(courseId: string): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }> {
    try {
      const reviews = await Review.findAll({
        where: { 
          courseId,
          status: 'approved'
        },
        attributes: ['rating'],
        raw: true,
      });

      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + (review as any).rating, 0) / totalReviews 
        : 0;

      const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach(review => {
        const rating = (review as any).rating;
        if (rating >= 1 && rating <= 5) {
          ratingDistribution[rating]++;
        }
      });

      return {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        ratingDistribution,
      };
    } catch (error) {
      console.error("Error getting review stats:", error);
      throw error;
    }
  }
}

