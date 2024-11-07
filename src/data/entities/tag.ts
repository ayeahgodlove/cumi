// models/Tag.ts
import sequelize from "@database/db-sequelize.config";
import { DataTypes, Model } from "sequelize";

class Tag extends Model {
  public id!: string;
  public name!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Tag.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
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
    tableName: "tags",
    timestamps: true,
  }
);

export default Tag;
