// src/domain/usecases/quiz-submission.usecase.ts

import { IQuizSubmission } from "@domain/models/quiz-submission.model";
import { IQuizSubmissionRepository } from "@data/repositories/contracts/repository.base";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { QuizSubmission } from "@data/entities/index";

export class QuizSubmissionUseCase {
  constructor(private readonly quizSubmissionRepository: IQuizSubmissionRepository) {}

  async submitQuiz(submission: IQuizSubmission): Promise<InstanceType<typeof QuizSubmission>> {
    try {
      // Get the latest attempt number for this user and quiz
      const latestAttempt = await this.quizSubmissionRepository.getLatestAttempt(
        submission.userId, 
        submission.quizId
      );
      
      const attemptNumber = latestAttempt ? latestAttempt.getDataValue('attemptNumber') + 1 : 1;
      
      // Set submission details
      submission.attemptNumber = attemptNumber;
      submission.submittedAt = new Date();
      submission.gradedAt = new Date(); // Auto-graded
      submission.status = 'graded';
      
      // Calculate if passed (70% threshold)
      submission.isPassed = submission.percentage >= 70;

      return await this.quizSubmissionRepository.create(submission);
    } catch (error) {
      console.error("Error in submitQuiz use case:", error);
      throw error;
    }
  }

  async getSubmissionById(id: string): Promise<InstanceType<typeof QuizSubmission>> {
    try {
      const submission = await this.quizSubmissionRepository.findById(id);
      if (!submission) {
        throw new NotFoundException(`Quiz submission with id ${id} not found`);
      }
      return submission;
    } catch (error) {
      console.error("Error in getSubmissionById use case:", error);
      throw error;
    }
  }

  async getUserQuizSubmissions(userId: string): Promise<InstanceType<typeof QuizSubmission>[]> {
    try {
      return await this.quizSubmissionRepository.findByUserId(userId);
    } catch (error) {
      console.error("Error in getUserQuizSubmissions use case:", error);
      throw error;
    }
  }

  async getQuizSubmissions(quizId: string): Promise<InstanceType<typeof QuizSubmission>[]> {
    try {
      return await this.quizSubmissionRepository.findByQuizId(quizId);
    } catch (error) {
      console.error("Error in getQuizSubmissions use case:", error);
      throw error;
    }
  }

  async getUserQuizPerformance(userId: string, courseId: string): Promise<InstanceType<typeof QuizSubmission>[]> {
    try {
      return await this.quizSubmissionRepository.getUserQuizPerformance(userId, courseId);
    } catch (error) {
      console.error("Error in getUserQuizPerformance use case:", error);
      throw error;
    }
  }

  async getCourseQuizSubmissions(courseId: string): Promise<InstanceType<typeof QuizSubmission>[]> {
    try {
      return await this.quizSubmissionRepository.findByCourseId(courseId);
    } catch (error) {
      console.error("Error in getCourseQuizSubmissions use case:", error);
      throw error;
    }
  }

  async getUserLatestAttempt(userId: string, quizId: string): Promise<InstanceType<typeof QuizSubmission> | null> {
    try {
      return await this.quizSubmissionRepository.getLatestAttempt(userId, quizId);
    } catch (error) {
      console.error("Error in getUserLatestAttempt use case:", error);
      throw error;
    }
  }

  async getQuizStatistics(quizId: string): Promise<{
    totalSubmissions: number;
    averageScore: number;
    passRate: number;
  }> {
    try {
      return await this.quizSubmissionRepository.getQuizStatistics(quizId);
    } catch (error) {
      console.error("Error in getQuizStatistics use case:", error);
      throw error;
    }
  }

  async updateSubmission(submission: IQuizSubmission): Promise<InstanceType<typeof QuizSubmission>> {
    try {
      const existingSubmission = await this.quizSubmissionRepository.findById(submission.id);
      if (!existingSubmission) {
        throw new NotFoundException(`Quiz submission with id ${submission.id} not found`);
      }

      return await this.quizSubmissionRepository.update(submission);
    } catch (error) {
      console.error("Error in updateSubmission use case:", error);
      throw error;
    }
  }

  async deleteSubmission(id: string, userId: string): Promise<void> {
    try {
      const existingSubmission = await this.quizSubmissionRepository.findById(id);
      if (!existingSubmission) {
        throw new NotFoundException(`Quiz submission with id ${id} not found`);
      }

      // Check if user owns this submission
      if (existingSubmission.getDataValue('userId') !== userId) {
        throw new Error("You can only delete your own quiz submissions");
      }

      await this.quizSubmissionRepository.delete(id);
    } catch (error) {
      console.error("Error in deleteSubmission use case:", error);
      throw error;
    }
  }
}
