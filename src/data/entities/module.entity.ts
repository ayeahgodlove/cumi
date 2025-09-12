// models/Module.ts
import { Sequelize } from "sequelize";

const Module = (sequelizeInstance: Sequelize, DataTypes: any) => {
  const ModuleModel = sequelizeInstance.define(
    "Module",
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
        allowNull: true,
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
      moduleOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'module_order',
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        allowNull: false,
        defaultValue: 'draft',
      },
      learningObjectives: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'learning_objectives',
      },
      prerequisites: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      estimatedDurationHours: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'estimated_duration_hours',
      },
      isLocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_locked',
      },
      unlockDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'unlock_date',
      },
      totalLessons: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'total_lessons',
      },
      totalQuizzes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'total_quizzes',
      },
      totalAssignments: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'total_assignments',
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
      tableName: 'modules',
      timestamps: true,
    }
  );

  return ModuleModel;
};

export default Module;
