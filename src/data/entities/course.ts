// models/Category.ts
import { Sequelize } from "sequelize";

const Course = (sequelize: Sequelize, DataTypes: any) => {
  const CourseModel = sequelize.define(
    "Course",
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
      description: {
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
        references: { model: "users", key: "id" },
      },
      categoryId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "categories", key: "id" },
      },
      authorName: {
        type: DataTypes.STRING,
        allowNull: false,
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
      price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        comment: 'Course price in XAF',
      },
      isFree: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_free',
        comment: 'Is course free',
      },
      currency: {
        type: DataTypes.STRING(5),
        defaultValue: 'XAF',
        comment: 'Currency code',
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'archived', 'suspended'),
        defaultValue: 'draft',
        comment: 'Course status',
      },
      level: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
        defaultValue: 'beginner',
        comment: 'Course difficulty level',
      },
      durationWeeks: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'duration_weeks',
        comment: 'Estimated course duration in weeks',
      },
      maxStudents: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'max_students',
        comment: 'Maximum students allowed',
      },
      currentStudents: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'current_students',
        comment: 'Current enrolled students',
      },
      language: {
        type: DataTypes.ENUM('french', 'english', 'both', 'fulfulde', 'ewondo'),
        defaultValue: 'both',
        comment: 'Course language',
      },
      targetAudience: {
        type: DataTypes.ENUM('students', 'professionals', 'entrepreneurs', 'farmers', 'teachers', 'youth', 'women'),
        allowNull: true,
        field: 'target_audience',
        comment: 'Target audience',
      },
      certificateAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'certificate_available',
        comment: 'Certificate available upon completion',
      },
      prerequisites: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Course prerequisites',
      },
      learningOutcomes: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'learning_outcomes',
        comment: 'What students will learn',
      },
      instructorContact: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'instructor_contact',
        comment: 'Instructor contact phone',
      },
    },
    {
      tableName: "courses",
      timestamps: true,
    }
  );

  // Add toJSON method to ensure proper serialization
  CourseModel.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  return CourseModel;
};

export default Course;

