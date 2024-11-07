enum STATUS {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  REJECTED = "REJECTED",
}

import sequelize from "@database/db-sequelize.config";
// models/Post.ts
import { DataTypes, Model } from "sequelize";
import Tag from "./tag";
import Category from "./category";

class Post extends Model {
  public id!: string;
  public title!: string;
  public description!: string;
  public content!: string;
  public imageUrl!: string;
  public slug!: string;
  public publishedAt!: Date;
  public authorId!: string;
  public categoryId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public status!: string;
}

Post.init(
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
      type: DataTypes.ENUM(STATUS.DRAFT, STATUS.PUBLISHED, STATUS.REJECTED),
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
    sequelize,
    tableName: "posts",
    timestamps: true,
  }
);

Post.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Post, { foreignKey: "categoryId" });

Post.belongsToMany(Tag, {
  through: {
    model: "post_tags",
    unique: false,
  },
  foreignKey: "postId",
  otherKey: "tagId",
  timestamps: false,
}); // Many-to-many relationship
Tag.belongsToMany(Post, {
  through: {
    model: "post_tags",
    unique: false,
  },
  foreignKey: "tagId",
  otherKey: "postId",
  timestamps: false,
});
export default Post;
