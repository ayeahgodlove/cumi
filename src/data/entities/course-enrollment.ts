// models/CourseEnrollment.ts
import { Sequelize } from "sequelize";

const CourseEnrollment = (sequelize: Sequelize, DataTypes: any) => {
  const CourseEnrollmentModel = sequelize.define(
    "CourseEnrollment",
    {
      id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
      },
      courseId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'courseId',
        references: { model: "courses", key: "id" },
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'userId',
        references: { model: "users", key: "id" },
      },
      enrollmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'enrollmentDate',
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM('active', 'completed', 'dropped', 'suspended'),
        defaultValue: 'active',
        comment: 'Enrollment status',
      },
      progress: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Progress percentage (0-100)',
        validate: {
          min: 0,
          max: 100,
        },
      },
      lastAccessedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'lastAccessedAt',
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'completedAt',
      },
      certificateIssued: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'certificateIssued',
      },
      certificateUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'certificateUrl',
      },
      notes: {
        type: DataTypes.TEXT,
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
      paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'partial', 'free', 'scholarship'),
        defaultValue: 'free',
        field: 'payment_status',
        comment: 'Payment status',
      },
      paymentMethod: {
        type: DataTypes.ENUM('mobile_money', 'bank_transfer', 'cash', 'scholarship', 'free'),
        allowNull: true,
        field: 'payment_method',
        comment: 'Payment method',
      },
      amountPaid: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        field: 'amount_paid',
        comment: 'Amount paid in XAF',
      },
      paymentReference: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'payment_reference',
        comment: 'Payment reference/transaction ID',
      },
      studentPhone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'student_phone',
        comment: 'Student contact phone',
      },
      emergencyContact: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'emergency_contact',
        comment: 'Emergency contact information',
      },
      educationLevel: {
        type: DataTypes.ENUM('primary', 'secondary', 'university', 'professional', 'other'),
        allowNull: true,
        field: 'education_level',
        comment: 'Student education level',
      },
      motivation: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Why student wants to take course',
      },
      offlineProgress: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'offline_progress',
        comment: 'Offline learning progress tracking',
      },
      studyGroup: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'study_group',
        comment: 'Study group or class name',
      },
      mentorAssigned: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'mentor_assigned',
        comment: 'Assigned mentor user ID',
      },
      completionTargetDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'completion_target_date',
        comment: 'Target completion date',
      },
      internetAccess: {
        type: DataTypes.ENUM('high_speed', 'mobile_data', 'limited', 'cybercafe'),
        allowNull: true,
        field: 'internet_access',
        comment: 'Internet access type',
      },
      preferredContact: {
        type: DataTypes.ENUM('whatsapp', 'sms', 'call', 'email'),
        defaultValue: 'whatsapp',
        field: 'preferred_contact',
        comment: 'Preferred contact method',
      },
      studySchedule: {
        type: DataTypes.ENUM('morning', 'afternoon', 'evening', 'weekend', 'flexible'),
        allowNull: true,
        field: 'study_schedule',
        comment: 'Preferred study time',
      },
      certificateName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'certificate_name',
        comment: 'Name for certificate',
      },
      certificateLanguage: {
        type: DataTypes.ENUM('french', 'english', 'both'),
        defaultValue: 'both',
        field: 'certificate_language',
        comment: 'Certificate language preference',
      },
      skillsGained: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'skills_gained',
        comment: 'Skills/competencies gained',
      },
    },
    {
      tableName: "course_enrollments",
      timestamps: true,
    }
  );

  return CourseEnrollmentModel;
};

export default CourseEnrollment;
