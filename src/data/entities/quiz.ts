// models/Quiz.ts
import sequelize from "@database/db-sequelize.config";
import { DataTypes, Model } from "sequelize";

class Quiz extends Model {
  public id!: string;
  public question!: string;
  public answers!: string[];
  public correctAnswerIndex!: number;
  public lessonId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Quiz.init(
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
      allowNull: true,
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
    sequelize,
    tableName: "quizs",
    timestamps: true,
  }
);

export default Quiz;
