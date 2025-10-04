// models/User.ts
import { Model, Sequelize } from "sequelize";

interface IUserAttributes {
  id: string;
  email: string;
  username: string;
  fullname?: string;
  password: string;
  authStrategy?: string;
  address?: string;
  role?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const User = (sequelize: Sequelize, DataTypes: any) => {
  const UserModel = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(128),
        unique: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      fullname: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      authStrategy: {
        type: DataTypes.STRING(50),
      },
      address: {
        type: DataTypes.STRING(255),
      },
      role: {
        type: DataTypes.STRING(50),
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      // Profile fields
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "phone_number",
      },
      countryCode: {
        type: DataTypes.STRING(5),
        allowNull: true,
        field: "country_code",
      },
      profileImage: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: "profile_image",
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "date_of_birth",
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "other", "prefer_not_to_say"),
        allowNull: true,
      },
      // Account status
      accountStatus: {
        type: DataTypes.ENUM("active", "inactive", "suspended", "banned", "pending"),
        defaultValue: "pending",
        field: "account_status",
      },
      // Email verification
      emailVerifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "email_verified_at",
      },
      emailVerificationToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "email_verification_token",
      },
      // Password reset
      resetToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "password_reset_token",
      },
      resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "password_reset_expires_at",
      },
      // Two-factor authentication
      twoFactorEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "two_factor_enabled",
      },
      twoFactorSecret: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "two_factor_secret",
      },
      // Activity tracking
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "last_login_at",
      },
      lastActiveAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "last_active_at",
      },
      // Security
      loginAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "login_attempts",
      },
      lockedUntil: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "locked_until",
      },
      lastPasswordChange: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "last_password_change",
      },
      // Localization
      timezone: {
        type: DataTypes.STRING(50),
        defaultValue: "UTC",
      },
      locale: {
        type: DataTypes.STRING(10),
        defaultValue: "en",
      },
      // Preferences
      notificationPreferences: {
        type: DataTypes.JSON,
        allowNull: true,
        field: "notification_preferences",
      },
      // Notifications
      emailNotifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "email_notifications",
      },
      smsNotifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "sms_notifications",
      },
      // Soft delete
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "deleted_at",
      },
      deletedBy: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "deleted_by",
      },
      // Referral system
      referralCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "referral_code",
      },
      referredBy: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "referred_by",
      },
      // Registration tracking
      registrationIp: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: "registration_ip",
      },
      // Timestamps
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
      tableName: "users",
      timestamps: true,
    }
  );

  // Add toJSON method to ensure proper serialization
  UserModel.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  return UserModel;
};

export default User;

