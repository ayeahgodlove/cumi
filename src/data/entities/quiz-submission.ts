// src/data/entities/quiz-submission.ts

import { Sequelize } from "sequelize";

const QuizSubmission = (sequelize: Sequelize, DataTypes: any) => {
  const QuizSubmissionModel = sequelize.define(
    "QuizSubmission",
    {
      id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      quizId: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
          model: "quizes",
          key: "id",
        },
      },
      lessonId: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
          model: "lessons",
          key: "id",
        },
      },
      courseId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: "courses",
          key: "id",
        },
      },
      moduleId: {
        type: DataTypes.STRING(20),
        allowNull: true,
        references: {
          model: "modules",
          key: "id",
        },
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Points scored by the user",
      },
      maxScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "max_score",
        comment: "Maximum possible points",
      },
      percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: "Percentage score (0-100)",
      },
      answers: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        comment: "JSON array of user answers",
      },
      correctAnswers: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        field: "correct_answers",
        comment: "JSON array of correct answers",
      },
      timeSpentSeconds: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "time_spent_seconds",
        comment: "Time spent on quiz in seconds",
      },
      attemptNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: "attempt_number",
        comment: "Which attempt this is (1st, 2nd, etc.)",
      },
      isPassed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_passed",
        comment: "Whether the user passed the quiz",
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "submitted_at",
        comment: "When the quiz was submitted",
      },
      gradedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "graded_at",
        comment: "When the quiz was graded",
      },
      status: {
        type: DataTypes.ENUM('submitted', 'graded', 'review'),
        allowNull: false,
        defaultValue: 'graded',
        comment: "Status of the submission",
      },
      feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Instructor feedback on the submission",
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "updated_at",
      },
    },
    {
      tableName: "quiz_submissions",
      timestamps: true,
      indexes: [
        {
          fields: ["userId", "quizId"],
          name: "idx_user_quiz",
        },
        {
          fields: ["courseId", "userId"],
          name: "idx_course_user",
        },
        {
          fields: ["lessonId", "userId"],
          name: "idx_lesson_user",
        },
        {
          fields: ["submittedAt"],
          name: "idx_submitted_at",
        },
      ],
    }
  );

  return QuizSubmissionModel;
};

export default QuizSubmission;

