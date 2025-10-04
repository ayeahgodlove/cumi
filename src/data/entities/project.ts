// models/Project.ts
import { Model, Sequelize } from "sequelize";

const Project = (sequelize: Sequelize, DataTypes: any) => {
  const ProjectModel = sequelize.define(
    "Project",
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
        type: DataTypes.STRING,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      githubUrl: {
        type: DataTypes.STRING,
      },
      deployUrl: {
        type: DataTypes.STRING,
      },
      userId: {
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
      tableName: "projects",
      timestamps: true,
    }
  );

  return ProjectModel;
};
export default Project;

