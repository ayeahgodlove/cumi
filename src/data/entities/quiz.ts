// src/data/entities/quiz.ts

import { Sequelize } from "sequelize";

const Quiz = (sequelize: Sequelize, DataTypes: any) => {
  const QuizModel = sequelize.define(
    "Quiz",
    {
      // Database field order: id, question, answers, slug, userId, lessonId, correctAnswerIndex, created_at, updated_at, title, instructions, quiz_type, points, time_limit_minutes, difficulty, explanation, local_example, pass_required, quiz_order, status, language
      
      id: {
        type: DataTypes.STRING(10),
        primaryKey: true,
      },
      question: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true,
      },
      answers: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        comment: 'JSON string array of answer options',
      },
      slug: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: true,
        references: {
          model: "users",
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
      correctAnswerIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Quiz title',
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Quiz instructions',
      },
      quizType: {
        type: DataTypes.ENUM('multiple_choice', 'true_false', 'fill_blank', 'short_answer', 'essay'),
        allowNull: false,
        defaultValue: 'multiple_choice',
        field: 'quiz_type',
        comment: 'Type of question',
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Points for correct answer',
      },
      timeLimitMinutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'time_limit_minutes',
        comment: 'Time limit in minutes',
      },
      difficulty: {
        type: DataTypes.ENUM('easy', 'medium', 'hard'),
        allowNull: false,
        defaultValue: 'easy',
        comment: 'Question difficulty',
      },
      explanation: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Explanation for correct answer',
      },
      localExample: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'local_example',
        comment: 'Cameroon-specific example',
      },
      passRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'pass_required',
        comment: 'Must pass to continue course',
      },
      quizOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'quiz_order',
        comment: 'Order of quiz within lesson',
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Quiz status',
      },
      language: {
        type: DataTypes.ENUM('french', 'english', 'both'),
        allowNull: false,
        defaultValue: 'both',
        comment: 'Quiz language',
      },
    },
    {
      tableName: "quizes",
      timestamps: true,
    }
  );

  // Add toJSON method to ensure proper serialization
  QuizModel.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  return QuizModel;
};

export default Quiz;