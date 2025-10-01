import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@database/db-sequelize.config";
import { ICourseEnrollment } from "@domain/models/course-enrollment.model";

export interface CourseEnrollmentCreationAttributes extends Optional<ICourseEnrollment, 'id' | 'createdAt' | 'updatedAt'> {}

export class CourseEnrollmentEntity extends Model<ICourseEnrollment, CourseEnrollmentCreationAttributes> implements ICourseEnrollment {
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
  public paymentStatus!: 'pending' | 'paid' | 'partial' | 'free' | 'scholarship';
  public paymentMethod?: 'mobile_money' | 'bank_transfer' | 'cash' | 'scholarship' | 'free';
  public amountPaid!: number;
  public paymentReference?: string;
  public studentPhone?: string;
  public emergencyContact?: string;
  public educationLevel?: 'primary' | 'secondary' | 'university' | 'professional' | 'other';
  public motivation?: string;
  public offlineProgress?: string;
  public studyGroup?: string;
  public mentorAssigned?: string;
  public completionTargetDate?: Date;
  public internetAccess?: 'high_speed' | 'mobile_data' | 'limited' | 'cybercafe';
  public preferredContact!: 'whatsapp' | 'sms' | 'call' | 'email';
  public studySchedule?: 'morning' | 'afternoon' | 'evening' | 'weekend' | 'flexible';
  public certificateName?: string;
  public certificateLanguage!: 'french' | 'english' | 'both';
  public skillsGained?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CourseEnrollmentEntity.init(
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
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'partial', 'free', 'scholarship'),
      allowNull: false,
      defaultValue: 'free',
    },
    paymentMethod: {
      type: DataTypes.ENUM('mobile_money', 'bank_transfer', 'cash', 'scholarship', 'free'),
      allowNull: true,
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    paymentReference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    studentPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emergencyContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    educationLevel: {
      type: DataTypes.ENUM('primary', 'secondary', 'university', 'professional', 'other'),
      allowNull: true,
    },
    motivation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    offlineProgress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    studyGroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mentorAssigned: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    completionTargetDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    internetAccess: {
      type: DataTypes.ENUM('high_speed', 'mobile_data', 'limited', 'cybercafe'),
      allowNull: true,
    },
    preferredContact: {
      type: DataTypes.ENUM('whatsapp', 'sms', 'call', 'email'),
      allowNull: false,
      defaultValue: 'whatsapp',
    },
    studySchedule: {
      type: DataTypes.ENUM('morning', 'afternoon', 'evening', 'weekend', 'flexible'),
      allowNull: true,
    },
    certificateName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    certificateLanguage: {
      type: DataTypes.ENUM('french', 'english', 'both'),
      allowNull: false,
      defaultValue: 'both',
    },
    skillsGained: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'course_enrollments',
    timestamps: true,
  }
);

// Add toJSON method to ensure proper serialization
CourseEnrollmentEntity.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  return values;
};

export default CourseEnrollmentEntity;
