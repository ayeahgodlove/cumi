// models/Category.ts
import sequelize from "@database/db-sequelize.config";
import { DataTypes, Model } from "sequelize";

class Course extends Model {
  public id!: string;
  public title!: string;
  public slug!: string;
  public description!: string;
  public imageUrl!: string;
  public userId!: string;
  public categoryId!: string;
  public authorName!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Course.init(
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
      references: {
        model: "User",
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Category",
        key: "id",
      },
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
    sequelize,
    tableName: "courses",
    timestamps: true,
  }
);

export default Course;
