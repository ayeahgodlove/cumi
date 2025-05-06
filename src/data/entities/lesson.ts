// models/Category.t

import { Sequelize } from "sequelize";

const Lesson = (sequelize: Sequelize, DataTypes: any) => {
  const LessonModel = sequelize.define(
    "Lesson",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      courseId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "courses",
          key: "id",
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      prerequisites: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      objectives: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      keywords: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      rating: {
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
      tableName: "lessons",
      timestamps: true,
    }
  );

  return LessonModel;
};

export default Lesson;
