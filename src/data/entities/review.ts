// src/data/entities/review.ts

import { Sequelize } from "sequelize";

const Review = (sequelize: Sequelize, DataTypes: any) => {
  const ReviewModel = sequelize.define(
    "Review",
    {
      id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      courseId: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
          model: "courses",
          key: "id",
        },
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
        comment: "Rating from 1 to 5 stars",
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Detailed review text",
      },
      wouldRecommend: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "would_recommend",
        comment: "Whether the student would recommend this course",
      },
      difficulty: {
        type: DataTypes.ENUM('very_easy', 'easy', 'medium', 'hard', 'very_hard'),
        allowNull: true,
        comment: "Perceived difficulty level",
      },
      isAnonymous: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_anonymous",
        comment: "Whether to hide the reviewer's name",
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
        comment: "Review moderation status",
      },
      helpfulVotes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "helpful_votes",
        comment: "Number of users who found this review helpful",
      },
      language: {
        type: DataTypes.ENUM('french', 'english', 'both'),
        allowNull: false,
        defaultValue: 'english',
        comment: "Language of the review",
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
      tableName: "reviews",
      timestamps: true,
      indexes: [
        {
          fields: ["courseId"],
        },
        {
          fields: ["userId"],
        },
        {
          fields: ["rating"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["created_at"],
        },
        {
          unique: true,
          fields: ["userId", "courseId"],
          name: "unique_user_course_review",
        },
      ],
    }
  );

  // Add toJSON method to ensure proper serialization
  ReviewModel.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  return ReviewModel;
};

export default Review;

