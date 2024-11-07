// models/PostTag.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "@database/db-sequelize.config";
import Post from "./post";
import Tag from "./tag";

class PostTag extends Model {
  public postId!: string;
  public tagId!: string;
}

PostTag.init(
  {
    postId: {
      type: DataTypes.STRING,
      references: {
        model: Post,
        key: "id",
      },
      onDelete: "CASCADE",
      allowNull: false,
    },
    tagId: {
      type: DataTypes.STRING,
      references: {
        model: Tag,
        key: "id",
      },
      onDelete: "CASCADE",
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "post_tags",
    timestamps: false, // Enable if you want to track creation or update timestamps
  }
);

export default PostTag;
