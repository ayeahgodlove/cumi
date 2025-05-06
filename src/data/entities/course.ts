// models/Category.ts
import { Sequelize } from "sequelize";

const Course = (sequelize: Sequelize, DataTypes: any) => {
  const CourseModel = sequelize.define(
    "Course",
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      categoryId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "categories", key: "id" },
      },
      authorName: {
        type: DataTypes.STRING,
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
      tableName: "courses",
      timestamps: true,
    }
  );

  return CourseModel;
};

export default Course;
