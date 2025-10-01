// src/domain/usecases/review.usecase.ts

import { IReview } from "@domain/models/review.model";
import { IReviewRepository } from "@data/repositories/contracts/repository.base";
import { ICourseRepository } from "@data/repositories/contracts/repository.base";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { Review } from "@data/entities/index";

export class ReviewUseCase {
  constructor(
    private readonly reviewRepository: IReviewRepository,
    private readonly courseRepository: ICourseRepository
  ) {}

  async createReview(review: IReview): Promise<InstanceType<typeof Review>> {
    try {
      console.log("Creating review with data:", review);
      
      // First, verify that the course exists
      const course = await this.courseRepository.findById(review.courseId);
      if (!course) {
        throw new Error(`Course with ID ${review.courseId} does not exist.`);
      }
      console.log("Course found:", course.getDataValue('title'));
      
      // Check if user already has a review for this course
      const existingReview = await this.reviewRepository.findByUserAndCourse(
        review.userId, 
        review.courseId
      );

      if (existingReview) {
        throw new Error("You have already submitted a review for this course. You can edit your existing review instead.");
      }

      // Validate rating
      if (review.rating < 1 || review.rating > 5) {
        throw new Error("Rating must be between 1 and 5 stars");
      }

      // Set default status for new reviews
      review.status = 'pending';
      review.helpfulVotes = 0;

      console.log("About to create review in repository with:", review);
      return await this.reviewRepository.create(review);
    } catch (error) {
      console.error("Error in createReview use case:", error);
      throw error;
    }
  }

  async updateReview(review: IReview): Promise<InstanceType<typeof Review>> {
    try {
      const existingReview = await this.reviewRepository.findById(review.id);
      if (!existingReview) {
        throw new NotFoundException(`Review with id ${review.id} not found`);
      }

      // Validate rating
      if (review.rating < 1 || review.rating > 5) {
        throw new Error("Rating must be between 1 and 5 stars");
      }

      // Reset status to pending when review is updated
      review.status = 'pending';

      return await this.reviewRepository.update(review);
    } catch (error) {
      console.error("Error in updateReview use case:", error);
      throw error;
    }
  }

  async deleteReview(id: string, userId: string): Promise<void> {
    try {
      const existingReview = await this.reviewRepository.findById(id);
      if (!existingReview) {
        throw new NotFoundException(`Review with id ${id} not found`);
      }

      // Check if user owns this review
      if (existingReview.getDataValue('userId') !== userId) {
        throw new Error("You can only delete your own reviews");
      }

      await this.reviewRepository.delete(id);
    } catch (error) {
      console.error("Error in deleteReview use case:", error);
      throw error;
    }
  }

  async getReviewById(id: string): Promise<InstanceType<typeof Review>> {
    try {
      const review = await this.reviewRepository.findById(id);
      if (!review) {
        throw new NotFoundException(`Review with id ${id} not found`);
      }
      return review;
    } catch (error) {
      console.error("Error in getReviewById use case:", error);
      throw error;
    }
  }

  async getReviewsByCourseId(courseId: string): Promise<InstanceType<typeof Review>[]> {
    try {
      return await this.reviewRepository.findApprovedByCourseId(courseId);
    } catch (error) {
      console.error("Error in getReviewsByCourseId use case:", error);
      throw error;
    }
  }

  async getReviewsByUserId(userId: string): Promise<InstanceType<typeof Review>[]> {
    try {
      return await this.reviewRepository.findByUserId(userId);
    } catch (error) {
      console.error("Error in getReviewsByUserId use case:", error);
      throw error;
    }
  }

  async getUserReviewForCourse(userId: string, courseId: string): Promise<InstanceType<typeof Review> | null> {
    try {
      return await this.reviewRepository.findByUserAndCourse(userId, courseId);
    } catch (error) {
      console.error("Error in getUserReviewForCourse use case:", error);
      throw error;
    }
  }

  async getAllReviews(): Promise<InstanceType<typeof Review>[]> {
    try {
      return await this.reviewRepository.getAll();
    } catch (error) {
      console.error("Error in getAllReviews use case:", error);
      throw error;
    }
  }

  async getPendingReviews(): Promise<InstanceType<typeof Review>[]> {
    try {
      return await this.reviewRepository.findByStatus('pending');
    } catch (error) {
      console.error("Error in getPendingReviews use case:", error);
      throw error;
    }
  }

  async approveReview(id: string, moderatorNotes?: string): Promise<InstanceType<typeof Review> | null> {
    try {
      return await this.reviewRepository.updateStatus(id, 'approved', moderatorNotes);
    } catch (error) {
      console.error("Error in approveReview use case:", error);
      throw error;
    }
  }

  async rejectReview(id: string, moderatorNotes?: string): Promise<InstanceType<typeof Review> | null> {
    try {
      return await this.reviewRepository.updateStatus(id, 'rejected', moderatorNotes);
    } catch (error) {
      console.error("Error in rejectReview use case:", error);
      throw error;
    }
  }


  async markReviewHelpful(id: string): Promise<InstanceType<typeof Review> | null> {
    try {
      return await this.reviewRepository.incrementHelpfulVotes(id);
    } catch (error) {
      console.error("Error in markReviewHelpful use case:", error);
      throw error;
    }
  }


  async getCourseReviewStats(courseId: string): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }> {
    try {
      return await this.reviewRepository.getReviewStatsByCourseId(courseId);
    } catch (error) {
      console.error("Error in getCourseReviewStats use case:", error);
      throw error;
    }
  }

  async getAverageCourseRating(courseId: string): Promise<number> {
    try {
      return await this.reviewRepository.getAverageRatingByCourseId(courseId);
    } catch (error) {
      console.error("Error in getAverageCourseRating use case:", error);
      throw error;
    }
  }
}
