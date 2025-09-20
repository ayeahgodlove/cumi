// src/data/repositories/impl/assignment-submission.repository.ts

import { IAssignmentSubmission } from "@domain/models/assignment-submission.model";
import { IAssignmentSubmissionRepository } from "../contracts/repository.base";
import { AssignmentSubmission, User, Assignment, Lesson, Course, Module } from "../../entities/index";
import { Op } from "sequelize";

export class AssignmentSubmissionRepository implements IAssignmentSubmissionRepository {
  async create(submission: IAssignmentSubmission): Promise<InstanceType<typeof AssignmentSubmission>> {
    try {
      return await AssignmentSubmission.create(submission as any);
    } catch (error) {
      console.error("Error creating assignment submission:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<InstanceType<typeof AssignmentSubmission> | null> {
    try {
      return await AssignmentSubmission.findByPk(id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "username", "avatar"],
          },
          {
            model: Assignment,
            as: "assignment",
            attributes: ["id", "title", "assignmentType", "dueDate", "maxScore", "passingScore"],
          },
          {
            model: Lesson,
            as: "lesson",
            attributes: ["id", "title", "slug"],
          },
          {
            model: Course,
            as: "course",
            attributes: ["id", "title", "slug"],
          },
          {
            model: Module,
            as: "module",
            attributes: ["id", "title", "slug"],
          },
          {
            model: User,
            as: "grader",
            attributes: ["id", "name", "username"],
          },
        ],
      });
    } catch (error) {
      console.error("Error finding assignment submission by ID:", error);
      throw error;
    }
  }

  async getAll(): Promise<InstanceType<typeof AssignmentSubmission>[]> {
    try {
      return await AssignmentSubmission.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "username"],
          },
          {
            model: Assignment,
            as: "assignment",
            attributes: ["id", "title", "assignmentType"],
          },
          {
            model: Course,
            as: "course",
            attributes: ["id", "title"],
          },
        ],
        order: [["submittedAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error getting all assignment submissions:", error);
      throw error;
    }
  }

  async update(submission: IAssignmentSubmission): Promise<InstanceType<typeof AssignmentSubmission>> {
    try {
      const [updatedRowsCount] = await AssignmentSubmission.update(submission as any, {
        where: { id: submission.id },
      });

      if (updatedRowsCount === 0) {
        throw new Error(`Assignment submission with id ${submission.id} not found`);
      }

      const updatedSubmission = await this.findById(submission.id);
      if (!updatedSubmission) {
        throw new Error(`Failed to retrieve updated assignment submission with id ${submission.id}`);
      }

      return updatedSubmission;
    } catch (error) {
      console.error("Error updating assignment submission:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const deletedRowsCount = await AssignmentSubmission.destroy({
        where: { id },
      });

      if (deletedRowsCount === 0) {
        throw new Error(`Assignment submission with id ${id} not found`);
      }
    } catch (error) {
      console.error("Error deleting assignment submission:", error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<InstanceType<typeof AssignmentSubmission>[]> {
    try {
      return await AssignmentSubmission.findAll({
        where: { userId },
        include: [
          {
            model: Assignment,
            as: "assignment",
            attributes: ["id", "title", "assignmentType", "dueDate"],
          },
          {
            model: Course,
            as: "course",
            attributes: ["id", "title"],
          },
          {
            model: User,
            as: "grader",
            attributes: ["id", "name", "username"],
          },
        ],
        order: [["submittedAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding assignment submissions by user ID:", error);
      throw error;
    }
  }

  async findByAssignmentId(assignmentId: string): Promise<InstanceType<typeof AssignmentSubmission>[]> {
    try {
      return await AssignmentSubmission.findAll({
        where: { assignmentId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "username"],
          },
          {
            model: User,
            as: "grader",
            attributes: ["id", "name", "username"],
          },
        ],
        order: [["submittedAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding assignment submissions by assignment ID:", error);
      throw error;
    }
  }

  async findByUserAndAssignment(userId: string, assignmentId: string): Promise<InstanceType<typeof AssignmentSubmission>[]> {
    try {
      return await AssignmentSubmission.findAll({
        where: { userId, assignmentId },
        include: [
          {
            model: Assignment,
            as: "assignment",
            attributes: ["id", "title", "assignmentType", "dueDate", "maxScore"],
          },
          {
            model: User,
            as: "grader",
            attributes: ["id", "name", "username"],
          },
        ],
        order: [["attemptNumber", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding assignment submissions by user and assignment:", error);
      throw error;
    }
  }

  async findByCourseId(courseId: string): Promise<InstanceType<typeof AssignmentSubmission>[]> {
    try {
      return await AssignmentSubmission.findAll({
        where: { courseId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "username"],
          },
          {
            model: Assignment,
            as: "assignment",
            attributes: ["id", "title", "assignmentType"],
          },
        ],
        order: [["submittedAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding assignment submissions by course ID:", error);
      throw error;
    }
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<InstanceType<typeof AssignmentSubmission>[]> {
    try {
      return await AssignmentSubmission.findAll({
        where: { userId, courseId },
        include: [
          {
            model: Assignment,
            as: "assignment",
            attributes: ["id", "title", "assignmentType", "dueDate"],
          },
          {
            model: User,
            as: "grader",
            attributes: ["id", "name", "username"],
          },
        ],
        order: [["submittedAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding assignment submissions by user and course:", error);
      throw error;
    }
  }

  async findByStatus(status: string): Promise<InstanceType<typeof AssignmentSubmission>[]> {
    try {
      return await AssignmentSubmission.findAll({
        where: { status },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "username"],
          },
          {
            model: Assignment,
            as: "assignment",
            attributes: ["id", "title", "assignmentType"],
          },
          {
            model: Course,
            as: "course",
            attributes: ["id", "title"],
          },
        ],
        order: [["submittedAt", "ASC"]],
      });
    } catch (error) {
      console.error("Error finding assignment submissions by status:", error);
      throw error;
    }
  }

  async findByGrader(graderId: string): Promise<InstanceType<typeof AssignmentSubmission>[]> {
    try {
      return await AssignmentSubmission.findAll({
        where: { gradedBy: graderId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "username"],
          },
          {
            model: Assignment,
            as: "assignment",
            attributes: ["id", "title", "assignmentType"],
          },
          {
            model: Course,
            as: "course",
            attributes: ["id", "title"],
          },
        ],
        order: [["gradedAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding assignment submissions by grader:", error);
      throw error;
    }
  }

  async getLatestAttempt(userId: string, assignmentId: string): Promise<InstanceType<typeof AssignmentSubmission> | null> {
    try {
      return await AssignmentSubmission.findOne({
        where: { userId, assignmentId },
        include: [
          {
            model: Assignment,
            as: "assignment",
            attributes: ["id", "title", "assignmentType", "dueDate", "maxScore"],
          },
          {
            model: User,
            as: "grader",
            attributes: ["id", "name", "username"],
          },
        ],
        order: [["attemptNumber", "DESC"]],
      });
    } catch (error) {
      console.error("Error getting latest assignment attempt:", error);
      throw error;
    }
  }

  async getUserAssignmentPerformance(userId: string, courseId: string): Promise<InstanceType<typeof AssignmentSubmission>[]> {
    try {
      return await AssignmentSubmission.findAll({
        where: { userId, courseId },
        include: [
          {
            model: Assignment,
            as: "assignment",
            attributes: ["id", "title", "assignmentType", "dueDate"],
          },
        ],
        order: [["submittedAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error getting user assignment performance:", error);
      throw error;
    }
  }

  async getAssignmentStatistics(assignmentId: string): Promise<{
    totalSubmissions: number;
    averageScore: number;
    passRate: number;
  }> {
    try {
      const submissions = await AssignmentSubmission.findAll({
        where: { assignmentId },
        attributes: ['score', 'isPassed'],
        raw: true,
      });

      const totalSubmissions = submissions.length;
      const averageScore = totalSubmissions > 0 
        ? submissions.reduce((sum, sub) => sum + ((sub as any).score || 0), 0) / totalSubmissions 
        : 0;
      const passedCount = submissions.filter(sub => (sub as any).isPassed).length;
      const passRate = totalSubmissions > 0 ? (passedCount / totalSubmissions) * 100 : 0;

      return {
        totalSubmissions,
        averageScore: Math.round(averageScore * 100) / 100,
        passRate: Math.round(passRate * 100) / 100,
      };
    } catch (error) {
      console.error("Error getting assignment statistics:", error);
      throw error;
    }
  }

  async updateGrade(id: string, score: number, feedback?: string, gradedBy?: string): Promise<InstanceType<typeof AssignmentSubmission> | null> {
    try {
      const submission = await this.findById(id);
      if (!submission) {
        throw new Error(`Assignment submission with id ${id} not found`);
      }

      const maxScore = submission.getDataValue('maxScore');
      const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
      const assignment = (submission as any).assignment;
      const passingScore = assignment?.passingScore || (maxScore * 0.7); // Default 70%
      const isPassed = score >= passingScore;

      const updateData: any = {
        score,
        percentage,
        isPassed,
        gradedAt: new Date(),
        status: 'graded',
      };

      if (feedback) updateData.instructorFeedback = feedback;
      if (gradedBy) updateData.gradedBy = gradedBy;

      const [updatedRowsCount] = await AssignmentSubmission.update(updateData, {
        where: { id },
      });

      if (updatedRowsCount === 0) {
        throw new Error(`Failed to update assignment submission with id ${id}`);
      }

      return await this.findById(id);
    } catch (error) {
      console.error("Error updating assignment grade:", error);
      throw error;
    }
  }
}
