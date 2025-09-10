// models/Quiz.ts
import { Model, Sequelize } from "sequelize";

const Quiz = (sequelize: Sequelize, DataTypes: any) => {
  const QuizModel = sequelize.define(
    "Quiz",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      question: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      answers: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },
      lessonId: {
        type: DataTypes.STRING(128),
        allowNull: false,
        references: {
          model: "Lesson",
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
    },
    {
      tableName: "quizes",
      timestamps: true,
    }
  );

  return QuizModel;
};
export default Quiz;
