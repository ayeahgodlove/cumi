// models/Project.ts
import sequelize from "@database/db-sequelize.config";
import { DataTypes, Model } from "sequelize";

class Project extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public imageUrl!: string;
  public githubUrl!: string;
  public deployUrl!: string;
  public userId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "projects",
    timestamps: true,
  }
);

export default Project;
