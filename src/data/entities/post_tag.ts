// models/PostTag.ts
import {  Model, Sequelize } from "sequelize";

const PostTag = (sequelize: Sequelize, DataTypes: any) => {
  const PostTagModel = sequelize.define(
    "PostTag",
    {
      postId: {
        type: DataTypes.STRING,
        references: {
          model: "posts",
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
      tagId: {
        type: DataTypes.STRING,
        references: {
          model: "tags",
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
    },
    {
      tableName: "post_tags",
      timestamps: false,
    }
  );

  return PostTagModel;
};
export default PostTag;

