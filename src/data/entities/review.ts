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
      enrollmentId: {
        type: DataTypes.STRING(20),
        allowNull: true,
        references: {
          model: "course_enrollments",
          key: "id",
        },
        comment: "Link to the enrollment that allows this review",
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
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "Review title/summary",
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Detailed review text",
      },
      pros: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "What the student liked about the course",
      },
      cons: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "What could be improved",
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
      instructorRating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "instructor_rating",
        validate: {
          min: 1,
          max: 5,
        },
        comment: "Rating specifically for the instructor",
      },
      contentQuality: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "content_quality",
        validate: {
          min: 1,
          max: 5,
        },
        comment: "Rating for course content quality",
      },
      valueForMoney: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "value_for_money",
        validate: {
          min: 1,
          max: 5,
        },
        comment: "Rating for value for money",
      },
      completionPercentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "completion_percentage",
        validate: {
          min: 0,
          max: 100,
        },
        comment: "How much of the course was completed when review was written",
      },
      isVerifiedPurchase: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_verified_purchase",
        comment: "Whether this review is from a verified enrollment",
      },
      isAnonymous: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_anonymous",
        comment: "Whether to hide the reviewer's name",
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'flagged'),
        allowNull: false,
        defaultValue: 'pending',
        comment: "Review moderation status",
      },
      moderatorNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "moderator_notes",
        comment: "Notes from moderator for approval/rejection",
      },
      helpfulVotes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "helpful_votes",
        comment: "Number of users who found this review helpful",
      },
      reportedCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "reported_count",
        comment: "Number of times this review was reported",
      },
      language: {
        type: DataTypes.ENUM('french', 'english', 'both'),
        allowNull: false,
        defaultValue: 'english',
        comment: "Language of the review",
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Additional tags for categorizing reviews",
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

  return ReviewModel;
};

export default Review;
