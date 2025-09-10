// models/Category.t

import { Sequelize } from "sequelize";

const Lesson = (sequelize: Sequelize, DataTypes: any) => {
  const LessonModel = sequelize.define(
    "Lesson",
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
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      courseId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "courses",
          key: "id",
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      prerequisites: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      objectives: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      keywords: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      language: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      // New fields from database schema
      // authorName: {
      //   type: DataTypes.STRING(255),
      //   allowNull: false,
      //   field: 'author_name',
      // },
      durationMinutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'duration_minutes',
        comment: 'Lesson duration in minutes',
      },
      lessonOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        field: 'lesson_order',
        comment: 'Order of lesson within course',
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft',
        comment: 'Lesson status',
      },
      lessonType: {
        type: DataTypes.ENUM('video', 'text', 'audio', 'practical', 'discussion', 'assignment'),
        defaultValue: 'text',
        field: 'lesson_type',
        comment: 'Type of lesson',
      },
      videoUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'video_url',
        comment: 'Video lesson URL',
      },
      audioUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'audio_url',
        comment: 'Audio lesson URL (important for low bandwidth)',
      },
      downloadMaterials: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'download_materials',
        comment: 'Downloadable materials URL',
      },
      isFreePreview: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_free_preview',
        comment: 'Free preview lesson',
      },
      requiresCompletion: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'requires_completion',
        comment: 'Must complete to proceed',
      },
      estimatedCompletionTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'estimated_completion_time',
        comment: 'Estimated completion time in minutes',
      },
      practicalExamples: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'practical_examples',
        comment: 'Local/Cameroon-specific examples',
      },
      resourcesNeeded: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'resources_needed',
        comment: 'Required materials or tools',
      },
    },
    {
      tableName: "lessons",
      timestamps: true,
    }
  );

  return LessonModel;
};

export default Lesson;
