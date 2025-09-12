// models/CourseProgress.ts
import { Sequelize } from "sequelize";

const CourseProgress = (sequelizeInstance: Sequelize, DataTypes: any) => {
  const CourseProgressModel = sequelizeInstance.define(
    "CourseProgress",
    {
      id: {
        type: DataTypes.STRING(20),
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      enrollmentId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: 'course_enrollments',
          key: 'id',
        },
      },
      courseId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      moduleId: {
        type: DataTypes.STRING(20),
        allowNull: true,
        references: {
          model: 'modules',
          key: 'id',
        },
      },
      lessonId: {
        type: DataTypes.STRING(20),
        allowNull: true,
        references: {
          model: 'lessons',
          key: 'id',
        },
      },
      quizId: {
        type: DataTypes.STRING(20),
        allowNull: true,
        references: {
          model: 'quizes',
          key: 'id',
        },
      },
      assignmentId: {
        type: DataTypes.STRING(20),
        allowNull: true,
        references: {
          model: 'assignments',
          key: 'id',
        },
      },
      progressType: {
        type: DataTypes.ENUM('lesson', 'quiz', 'assignment', 'module', 'course'),
        allowNull: false,
        defaultValue: 'lesson',
        field: 'progress_type',
      },
      status: {
        type: DataTypes.ENUM('not_started', 'in_progress', 'completed', 'failed', 'skipped'),
        allowNull: false,
        defaultValue: 'not_started',
      },
      completionPercentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'completion_percentage',
      },
      timeSpentMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'time_spent_minutes',
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'started_at',
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'completed_at',
      },
      lastAccessedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_accessed_at',
      },
      score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      maxScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: 'max_score',
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      maxAttempts: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'max_attempts',
      },
      currentPosition: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'current_position',
      },
      totalDuration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'total_duration',
      },
      bookmarks: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      difficultyRating: {
        type: DataTypes.ENUM('very_easy', 'easy', 'moderate', 'hard', 'very_hard'),
        allowNull: true,
        field: 'difficulty_rating',
      },
      feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      instructorFeedback: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'instructor_feedback',
      },
      isMandatory: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_mandatory',
      },
      weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 1.00,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      tableName: 'course_progress',
      timestamps: true,
    }
  );

  return CourseProgressModel;
};

export default CourseProgress;
