// models/Media.ts
import { Model, Sequelize } from "sequelize";

const Media = (sequelize: Sequelize, DataTypes: any) => {
  const MediaModel = sequelize.define(
    "Media",
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
      imageUrl: {
        type: DataTypes.STRING,
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
      tableName: "media_tbl",
      timestamps: true,
    }
  );

  return MediaModel;
};
export default Media;
