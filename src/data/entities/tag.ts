// models/Tag.ts
import { Model, Sequelize } from "sequelize";

const Tag = (sequelize: Sequelize, DataTypes: any) => {
  const TagModel = sequelize.define(
    "Tag",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
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
      tableName: "tags",
      timestamps: true,
    }
  );

  return TagModel;
};
export default Tag;

