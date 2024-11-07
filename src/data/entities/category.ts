// models/Category.ts
import sequelize from "@database/db-sequelize.config";
import { DataTypes, Model } from "sequelize";

class Category extends Model {
  public id!: string;
  public name!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    tableName: "categories",
    timestamps: true,
  }
);

export default Category;
