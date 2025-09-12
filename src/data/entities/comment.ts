import { Model, Sequelize } from "sequelize";

const Comment = (sequelize: Sequelize, DataTypes: any) => {
  const CommentModel = sequelize.define(
    "Comment",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      postId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "posts",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      parentId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: "comments",
          key: "id",
        },
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_approved",
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
      tableName: "comments",
      timestamps: true,
    }
  );

  return CommentModel;
};

export default Comment;
