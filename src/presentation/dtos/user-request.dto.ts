// src/presentation/dtos/user-request.dto.ts

import { emptyUser, IUser } from "@domain/models/user";
import { IsNotEmpty, IsString, Length, IsOptional, IsEnum, IsBoolean, IsDateString } from "class-validator";
import { nanoid } from "nanoid";
export class UserRequestDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 25)
  username: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  password: string;

  // New fields from database schema
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(['male', 'female', 'other', 'prefer_not_to_say'])
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';

  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended', 'banned', 'pending'])
  accountStatus?: 'active' | 'inactive' | 'suspended' | 'banned' | 'pending';

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean;

  constructor(data: IUser) {
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.fullName = data.fullName;
    this.phoneNumber = data.phoneNumber;
    this.countryCode = data.countryCode;
    this.profileImage = data.profileImage;
    this.bio = data.bio;
    this.dateOfBirth = data.dateOfBirth?.toISOString();
    this.gender = data.gender;
    this.accountStatus = data.accountStatus;
    this.address = data.address;
    this.role = data.role;
    this.verified = data.verified ? Boolean(data.verified) : undefined;
    this.timezone = data.timezone;
    this.locale = data.locale;
    this.emailNotifications = data.emailNotifications ? Boolean(data.emailNotifications) : undefined;
    this.smsNotifications = data.smsNotifications ? Boolean(data.smsNotifications) : undefined;
  }

  toData(): IUser {
    return {
      ...emptyUser,
      id: nanoid(20),
      username: this.username,
      email: this.email,
      password: this.password,
      fullName: this.fullName,
      phoneNumber: this.phoneNumber,
      countryCode: this.countryCode,
      profileImage: this.profileImage,
      bio: this.bio,
      dateOfBirth: this.dateOfBirth ? new Date(this.dateOfBirth) : undefined,
      gender: this.gender,
      accountStatus: this.accountStatus ?? 'pending',
      address: this.address ?? "",
      role: this.role ?? "",
      verified: this.verified ?? false,
      timezone: this.timezone ?? 'UTC',
      locale: this.locale ?? 'en',
      emailNotifications: this.emailNotifications ?? true,
      smsNotifications: this.smsNotifications ?? false,
    };
  }

  toUpdateData(data: IUser): IUser {
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      password: data.password,
      address: data.address,
      authStrategy: data.authStrategy,
      roles: data.roles,
      verified: data.verified,
      fullName: data.fullName,
      role: data.role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      phoneNumber: data.phoneNumber,
      countryCode: data.countryCode,
      profileImage: data.profileImage,
      bio: data.bio,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      accountStatus: data.accountStatus,
      emailVerifiedAt: data.emailVerifiedAt,
      emailVerificationToken: data.emailVerificationToken,
      passwordResetToken: data.passwordResetToken,
      passwordResetExpiresAt: data.passwordResetExpiresAt,
      twoFactorEnabled: data.twoFactorEnabled,
      twoFactorSecret: data.twoFactorSecret,
      lastLoginAt: data.lastLoginAt,
      lastActiveAt: data.lastActiveAt,
      loginAttempts: data.loginAttempts,
      lockedUntil: data.lockedUntil,
      timezone: data.timezone,
      locale: data.locale,
      notificationPreferences: data.notificationPreferences,
      deletedAt: data.deletedAt,
      deletedBy: data.deletedBy,
      lastPasswordChange: data.lastPasswordChange,
      referralCode: data.referralCode,
      referredBy: data.referredBy,
      registrationIp: data.registrationIp,
      emailNotifications: data.emailNotifications,
      smsNotifications: data.smsNotifications,
    };
  }
}
