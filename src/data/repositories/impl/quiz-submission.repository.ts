// src/data/repositories/impl/quiz-submission.repository.ts

import { IQuizSubmission } from "@domain/models/quiz-submission.model";
import { IQuizSubmissionRepository } from "../contracts/repository.base";
import { QuizSubmission, User, Quiz, Lesson, Course, Module } from "../../entities/index";
import { Op } from "sequelize";

export class QuizSubmissionRepository implements IQuizSubmissionRepository {
  async create(submission: IQuizSubmission): Promise<InstanceType<typeof QuizSubmission>> {
    try {
      return await QuizSubmission.create(submission as any);
    } catch (error) {
      console.error("Error creating quiz submission:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<InstanceType<typeof QuizSubmission> | null> {
    try {
      return await QuizSubmission.findByPk(id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "username", "avatar"],
          },
          {
            model: Quiz,
            as: "quiz",
            attributes: ["id", "title", "question", "difficulty", "points"],
          },
          {
            model: Lesson,
            as: "lesson",
            attributes: ["id", "title", "slug"],
          },
          {
            model: Course,
            as: "quizSubmissionCourse",
            attributes: ["id", "title", "slug"],
          },
          {
            model: Module,
            as: "module",
            attributes: ["id", "title", "slug"],
          },
        ],
      });
    } catch (error) {
      console.error("Error finding quiz submission by ID:", error);
      throw error;
    }
  }

  async getAll(): Promise<InstanceType<typeof QuizSubmission>[]> {
    try {
      return await QuizSubmission.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "username"],
          },
          {
            model: Quiz,
            as: "quiz",
            attributes: ["id", "title", "difficulty"],
          },
          {
            model: Course,
            as: "quizSubmissionCourse",
            attributes: ["id", "title"],
          },
        ],
        order: [["submittedAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error getting all quiz submissions:", error);
      throw error;
    }
  }

  async update(submission: IQuizSubmission): Promise<InstanceType<typeof QuizSubmission>> {
    try {
      const [updatedRowsCount] = await QuizSubmission.update(submission as any, {
        where: { id: submission.id },
      });

      if (updatedRowsCount === 0) {
        throw new Error(`Quiz submission with id ${submission.id} not found`);
      }

      const updatedSubmission = await this.findById(submission.id);
      if (!updatedSubmission) {
        throw new Error(`Failed to retrieve updated quiz submission with id ${submission.id}`);
      }

      return updatedSubmission;
    } catch (error) {
      console.error("Error updating quiz submission:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const deletedRowsCount = await QuizSubmission.destroy({
        where: { id },
      });

      if (deletedRowsCount === 0) {
        throw new Error(`Quiz submission with id ${id} not found`);
      }
    } catch (error) {
      console.error("Error deleting quiz submission:", error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<InstanceType<typeof QuizSubmission>[]> {
    try {
      return await QuizSubmission.findAll({
        where: { userId },
        include: [
          {
            model: Quiz,
            as: "quiz",
            attributes: ["id", "title", "difficulty", "points"],
          },
          {
            model: Lesson,
            as: "lesson",
            attributes: ["id", "title"],
          },
          {
            model: Course,
            as: "quizSubmissionCourse",
            attributes: ["id", "title"],
          },
        ],
        order: [["submittedAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding quiz submissions by user ID:", error);
      throw error;
    }
  }

  async findByQuizId(quizId: string): Promise<InstanceType<typeof QuizSubmission>[]> {
    try {
      return await QuizSubmission.findAll({
        where: { quizId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "username"],
          },
        ],
        order: [["submittedAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding quiz submissions by quiz ID:", error);
      throw error;
    }
  }

  async findByUserAndQuiz(userId: string, quizId: string): Promise<InstanceType<typeof QuizSubmission>[]> {
    try {
      return await QuizSubmission.findAll({
        where: { userId, quizId },
        include: [
          {
            model: Quiz,
            as: "quiz",
            attributes: ["id", "title", "difficulty", "points"],
          },
        ],
        order: [["attemptNumber", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding quiz submissions by user and quiz:", error);
      throw error;
    }
  }

  async findByCourseId(courseId: string): Promise<InstanceType<typeof QuizSubmission>[]> {
    try {
      return await QuizSubmission.findAll({
        where: { courseId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "username"],
          },
          {
            model: Quiz,
            as: "quiz",
            attributes: ["id", "title", "difficulty"],
          },
        ],
        order: [["submittedAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding quiz submissions by course ID:", error);
      throw error;
    }
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<InstanceType<typeof QuizSubmission>[]> {
    try {
      return await QuizSubmission.findAll({
        where: { userId, courseId },
        include: [
          {
            model: Quiz,
            as: "quiz",
            attributes: ["id", "title", "difficulty", "points"],
          },
          {
            model: Lesson,
            as: "lesson",
            attributes: ["id", "title"],
          },
        ],
        order: [["submittedAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding quiz submissions by user and course:", error);
      throw error;
    }
  }

  async findByLessonId(lessonId: string): Promise<InstanceType<typeof QuizSubmission>[]> {
    try {
      return await QuizSubmission.findAll({
        where: { lessonId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "username"],
          },
          {
            model: Quiz,
            as: "quiz",
            attributes: ["id", "title", "difficulty"],
          },
        ],
        order: [["submittedAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding quiz submissions by lesson ID:", error);
      throw error;
    }
  }

  async findByStatus(status: string): Promise<InstanceType<typeof QuizSubmission>[]> {
    try {
      return await QuizSubmission.findAll({
        where: { status },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "username"],
          },
          {
            model: Quiz,
            as: "quiz",
            attributes: ["id", "title", "difficulty"],
          },
        ],
        order: [["submittedAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error finding quiz submissions by status:", error);
      throw error;
    }
  }

  async getLatestAttempt(userId: string, quizId: string): Promise<InstanceType<typeof QuizSubmission> | null> {
    try {
      return await QuizSubmission.findOne({
        where: { userId, quizId },
        include: [
          {
            model: Quiz,
            as: "quiz",
            attributes: ["id", "title", "difficulty", "points"],
          },
        ],
        order: [["attemptNumber", "DESC"]],
      });
    } catch (error) {
      console.error("Error getting latest quiz attempt:", error);
      throw error;
    }
  }

  async getUserQuizPerformance(userId: string, courseId: string): Promise<InstanceType<typeof QuizSubmission>[]> {
    try {
      return await QuizSubmission.findAll({
        where: { userId, courseId },
        include: [
          {
            model: Quiz,
            as: "quiz",
            attributes: ["id", "title", "difficulty", "points"],
          },
          {
            model: Lesson,
            as: "lesson",
            attributes: ["id", "title"],
          },
        ],
        order: [["submittedAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error getting user quiz performance:", error);
      throw error;
    }
  }

  async getQuizStatistics(quizId: string): Promise<{
    totalSubmissions: number;
    averageScore: number;
    passRate: number;
  }> {
    try {
      const submissions = await QuizSubmission.findAll({
        where: { quizId },
        attributes: ['score', 'isPassed'],
        raw: true,
      });

      const totalSubmissions = submissions.length;
      const averageScore = totalSubmissions > 0 
        ? submissions.reduce((sum, sub) => sum + (sub as any).score, 0) / totalSubmissions 
        : 0;
      const passedCount = submissions.filter(sub => (sub as any).isPassed).length;
      const passRate = totalSubmissions > 0 ? (passedCount / totalSubmissions) * 100 : 0;

      return {
        totalSubmissions,
        averageScore: Math.round(averageScore * 100) / 100,
        passRate: Math.round(passRate * 100) / 100,
      };
    } catch (error) {
      console.error("Error getting quiz statistics:", error);
      throw error;
    }
  }
}

