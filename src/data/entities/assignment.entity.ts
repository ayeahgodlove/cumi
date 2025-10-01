// models/Assignment.ts
import { Sequelize } from "sequelize";

const Assignment = (sequelizeInstance: Sequelize, DataTypes: any) => {
  const AssignmentModel = sequelizeInstance.define(
    "Assignment",
    {
      id: {
        type: DataTypes.STRING(20),
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: 'courses',
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
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      assignmentType: {
        type: DataTypes.ENUM('essay', 'project', 'practical', 'presentation', 'research', 'coding', 'design'),
        allowNull: false,
        defaultValue: 'essay',
        field: 'assignment_type',
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        allowNull: false,
        defaultValue: 'draft',
      },
      assignmentOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'assignment_order',
      },
      maxScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 100.00,
        field: 'max_score',
      },
      passingScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 50.00,
        field: 'passing_score',
      },
      maxAttempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
        field: 'max_attempts',
      },
      timeLimitMinutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'time_limit_minutes',
      },
      availableFrom: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'available_from',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'due_date',
      },
      lateSubmissionAllowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'late_submission_allowed',
      },
      latePenaltyPercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: 'late_penalty_percent',
      },
      submissionFormat: {
        type: DataTypes.ENUM('text', 'file_upload', 'url', 'both_text_file'),
        allowNull: false,
        defaultValue: 'text',
        field: 'submission_format',
      },
      allowedFileTypes: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'allowed_file_types',
      },
      maxFileSizeMb: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 10,
        field: 'max_file_size_mb',
      },
      minWordCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'min_word_count',
      },
      maxWordCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'max_word_count',
      },
      autoGrade: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'auto_grade',
      },
      rubric: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      peerReviewEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'peer_review_enabled',
      },
      peerReviewsRequired: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'peer_reviews_required',
      },
      referenceMaterials: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'reference_materials',
      },
      sampleSubmissions: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'sample_submissions',
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
      tableName: 'assignments',
      timestamps: true,
    }
  );

  // Add toJSON method to ensure proper serialization
  AssignmentModel.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  return AssignmentModel;
};

export default Assignment;
