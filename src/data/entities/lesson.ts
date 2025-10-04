// models/Category.t

import { Sequelize } from "sequelize";

const Lesson = (sequelize: Sequelize, DataTypes: any) => {
  const LessonModel = sequelize.define(
    "Lesson",
    {
      // Database insertion order: id, title, slug, description, content, imageUrl, userId, courseId, moduleId, authorName, difficulty, prerequisites, objectives, keywords, reviews, language, rating, created_at, updated_at, duration_minutes, lesson_order, status, lesson_type, video_url, audio_url, download_materials, is_free_preview, requires_completion, estimated_completion_time, practical_examples, resources_needed
      
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
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
      moduleId: {
        type: DataTypes.STRING(20),
        allowNull: true,
        references: {
          model: "modules",
          key: "id",
        },
        comment: "Module this lesson belongs to",
      },
      authorName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      // Stored as JSON string in LONGTEXT
      prerequisites: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        comment: 'JSON string array',
      },
      objectives: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        comment: 'JSON string array',
      },
      keywords: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        comment: 'JSON string array',
      },
      // Stored as JSON string in LONGTEXT to match DB
      reviews: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        comment: 'JSON string array of reviews',
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
      durationMinutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'duration_minutes',
        comment: 'Lesson duration in minutes',
      },
      lessonOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'lesson_order',
        comment: 'Order of lesson within course',
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Lesson status',
      },
      lessonType: {
        type: DataTypes.ENUM('video', 'text', 'audio', 'practical', 'discussion', 'assignment'),
        allowNull: false,
        defaultValue: 'text',
        field: 'lesson_type',
        comment: 'Type of lesson',
      },
      videoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'video_url',
        comment: 'Video lesson URL',
      },
      audioUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'audio_url',
        comment: 'Audio lesson URL (important for low bandwidth)',
      },
      downloadMaterials: {
        type: DataTypes.STRING,
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

  // Add toJSON method to ensure proper serialization
  LessonModel.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  return LessonModel;
};

export default Lesson;
