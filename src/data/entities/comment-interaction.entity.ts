import { Model, Sequelize } from "sequelize";

interface ICommentInteractionAttributes {
  id: string;
  commentId: string;
  userId: string;
  interactionType: 'like' | 'dislike';
  createdAt: Date;
  updatedAt: Date;
}

const CommentInteraction = (sequelize: Sequelize, DataTypes: any) => {
  const CommentInteractionModel = sequelize.define(
    "CommentInteraction",
    {
      id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
      },
      commentId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: "commentId",
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: "userId",
      },
      interactionType: {
        type: DataTypes.ENUM('like', 'dislike'),
        allowNull: false,
        field: "interactionType",
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
      tableName: "comment_interactions",
      timestamps: true,
    }
  );

  return CommentInteractionModel;
};

export default CommentInteraction;
