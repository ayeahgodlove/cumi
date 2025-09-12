// models/PostInteraction.ts
import { Sequelize } from "sequelize";

const PostInteraction = (sequelizeInstance: Sequelize, DataTypes: any) => {
  const PostInteractionModel = sequelizeInstance.define(
    "PostInteraction",
    {
      id: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
      },
      postId: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      action: {
        type: DataTypes.ENUM('like', 'dislike'),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "post_interactions",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['postId', 'userId'],
          name: 'unique_post_user_interaction',
        },
        {
          fields: ['postId'],
        },
        {
          fields: ['userId'],
        },
      ],
    }
  );

  return PostInteractionModel;
};

export default PostInteraction;
