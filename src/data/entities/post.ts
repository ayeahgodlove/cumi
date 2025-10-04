enum STATUS {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  REJECTED = "REJECTED",
}

// models/Post.ts
import { Model, Sequelize } from "sequelize";

const Post = (sequelize: Sequelize, DataTypes: any) => {
  const PostModel = sequelize.define(
    "Post",
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
      description: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.TEXT,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      authorId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("DRAFT", "PUBLISHED", "REJECTED"),
        allowNull: false,
      },
      publishedAt: {
        type: DataTypes.DATE,
        field: "published_at",
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
      tableName: "posts",
      timestamps: true,
    }
  );

  return PostModel;
};
export default Post;

