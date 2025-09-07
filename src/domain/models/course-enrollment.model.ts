import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@database/db-sequelize.config";

export interface ICourseEnrollment {
  id: string;
  courseId: string;
  userId: string;
  enrollmentDate: Date;
  status: 'active' | 'completed' | 'dropped' | 'suspended';
  progress: number; // 0-100 percentage
  lastAccessedAt?: Date;
  completedAt?: Date;
  certificateIssued: boolean;
  certificateUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseEnrollmentCreationAttributes extends Optional<ICourseEnrollment, 'id' | 'createdAt' | 'updatedAt'> {}

export class CourseEnrollment extends Model<ICourseEnrollment, CourseEnrollmentCreationAttributes> implements ICourseEnrollment {
  public id!: string;
  public courseId!: string;
  public userId!: string;
  public enrollmentDate!: Date;
  public status!: 'active' | 'completed' | 'dropped' | 'suspended';
  public progress!: number;
  public lastAccessedAt?: Date;
  public completedAt?: Date;
  public certificateIssued!: boolean;
  public certificateUrl?: string;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CourseEnrollment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    enrollmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'dropped', 'suspended'),
      allowNull: false,
      defaultValue: 'active',
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    lastAccessedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    certificateIssued: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    certificateUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    sequelize,
    tableName: 'course_enrollments',
    timestamps: true,
  }
);

export const emptyCourseEnrollment: Partial<ICourseEnrollment> = {
  courseId: '',
  userId: '',
  enrollmentDate: new Date(),
  status: 'active',
  progress: 0,
  certificateIssued: false,
};
