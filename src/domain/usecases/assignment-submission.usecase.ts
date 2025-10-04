// src/domain/usecases/assignment-submission.usecase.ts

import { IAssignmentSubmission } from "@domain/models/assignment-submission.model";
import { IAssignmentSubmissionRepository } from "@data/repositories/contracts/repository.base";
import { NotFoundException } from "@shared/exceptions/not-found.exception";
import { AssignmentSubmission } from "@data/entities/index";

export class AssignmentSubmissionUseCase {
  constructor(private readonly assignmentSubmissionRepository: IAssignmentSubmissionRepository) {}

  async submitAssignment(submission: IAssignmentSubmission): Promise<InstanceType<typeof AssignmentSubmission>> {
    try {
      // Get the latest attempt number for this user and assignment
      const latestAttempt = await this.assignmentSubmissionRepository.getLatestAttempt(
        submission.userId, 
        submission.assignmentId
      );
      
      const attemptNumber = latestAttempt ? latestAttempt.getDataValue('attemptNumber') + 1 : 1;
      
      // Set submission details
      submission.attemptNumber = attemptNumber;
      submission.submittedAt = new Date();
      submission.status = 'submitted';
      
      // Check if submission is late (this would need assignment due date logic)
      // For now, we'll set it as not late
      submission.isLate = false;

      return await this.assignmentSubmissionRepository.create(submission);
    } catch (error) {
      console.error("Error in submitAssignment use case:", error);
      throw error;
    }
  }

  async gradeAssignment(
    id: string, 
    score: number, 
    feedback?: string, 
    gradedBy?: string
  ): Promise<InstanceType<typeof AssignmentSubmission> | null> {
    try {
      return await this.assignmentSubmissionRepository.updateGrade(id, score, feedback, gradedBy);
    } catch (error) {
      console.error("Error in gradeAssignment use case:", error);
      throw error;
    }
  }

  async getSubmissionById(id: string): Promise<InstanceType<typeof AssignmentSubmission>> {
    try {
      const submission = await this.assignmentSubmissionRepository.findById(id);
      if (!submission) {
        throw new NotFoundException(`Assignment submission with id ${id} not found`, "ASSIGNMENT_SUBMISSION_NOT_FOUND");
      }
      return submission;
    } catch (error) {
      console.error("Error in getSubmissionById use case:", error);
      throw error;
    }
  }

  async getUserAssignmentSubmissions(userId: string): Promise<InstanceType<typeof AssignmentSubmission>[]> {
    try {
      return await this.assignmentSubmissionRepository.findByUserId(userId);
    } catch (error) {
      console.error("Error in getUserAssignmentSubmissions use case:", error);
      throw error;
    }
  }

  async getAssignmentSubmissions(assignmentId: string): Promise<InstanceType<typeof AssignmentSubmission>[]> {
    try {
      return await this.assignmentSubmissionRepository.findByAssignmentId(assignmentId);
    } catch (error) {
      console.error("Error in getAssignmentSubmissions use case:", error);
      throw error;
    }
  }

  async getUserAssignmentPerformance(userId: string, courseId: string): Promise<InstanceType<typeof AssignmentSubmission>[]> {
    try {
      return await this.assignmentSubmissionRepository.getUserAssignmentPerformance(userId, courseId);
    } catch (error) {
      console.error("Error in getUserAssignmentPerformance use case:", error);
      throw error;
    }
  }

  async getCourseAssignmentSubmissions(courseId: string): Promise<InstanceType<typeof AssignmentSubmission>[]> {
    try {
      return await this.assignmentSubmissionRepository.findByCourseId(courseId);
    } catch (error) {
      console.error("Error in getCourseAssignmentSubmissions use case:", error);
      throw error;
    }
  }

  async getUserLatestAttempt(userId: string, assignmentId: string): Promise<InstanceType<typeof AssignmentSubmission> | null> {
    try {
      return await this.assignmentSubmissionRepository.getLatestAttempt(userId, assignmentId);
    } catch (error) {
      console.error("Error in getUserLatestAttempt use case:", error);
      throw error;
    }
  }

  async getAssignmentStatistics(assignmentId: string): Promise<{
    totalSubmissions: number;
    averageScore: number;
    passRate: number;
  }> {
    try {
      return await this.assignmentSubmissionRepository.getAssignmentStatistics(assignmentId);
    } catch (error) {
      console.error("Error in getAssignmentStatistics use case:", error);
      throw error;
    }
  }

  async updateSubmission(submission: IAssignmentSubmission): Promise<InstanceType<typeof AssignmentSubmission>> {
    try {
      const existingSubmission = await this.assignmentSubmissionRepository.findById(submission.id);
      if (!existingSubmission) {
        throw new NotFoundException(`Assignment submission with id ${submission.id} not found`, "ASSIGNMENT_SUBMISSION_NOT_FOUND");
      }

      return await this.assignmentSubmissionRepository.update(submission);
    } catch (error) {
      console.error("Error in updateSubmission use case:", error);
      throw error;
    }
  }

  async deleteSubmission(id: string, userId: string): Promise<void> {
    try {
      const existingSubmission = await this.assignmentSubmissionRepository.findById(id);
      if (!existingSubmission) {
        throw new NotFoundException(`Assignment submission with id ${id} not found`, "ASSIGNMENT_SUBMISSION_NOT_FOUND");
      }

      // Check if user owns this submission
      if (existingSubmission.getDataValue('userId') !== userId) {
        throw new Error("You can only delete your own assignment submissions");
      }

      await this.assignmentSubmissionRepository.delete(id);
    } catch (error) {
      console.error("Error in deleteSubmission use case:", error);
      throw error;
    }
  }

  async getPendingSubmissions(): Promise<InstanceType<typeof AssignmentSubmission>[]> {
    try {
      return await this.assignmentSubmissionRepository.findByStatus('submitted');
    } catch (error) {
      console.error("Error in getPendingSubmissions use case:", error);
      throw error;
    }
  }

  async getGradedSubmissions(graderId: string): Promise<InstanceType<typeof AssignmentSubmission>[]> {
    try {
      return await this.assignmentSubmissionRepository.findByGrader(graderId);
    } catch (error) {
      console.error("Error in getGradedSubmissions use case:", error);
      throw error;
    }
  }
}

