import { IBanner } from "./banner.model";
import { IBaseState } from "./base-state.model";
import { IEvent } from "./event.model";
import { IPost } from "./post.model";
import { IProject } from "./project.model";
import { IResponseBase } from "./response-base.model";
import { IRole } from "./role.model";
import { IService } from "./service.model";

export interface IUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  password: string;
  authStrategy: string;
  address: string;
  verified: Boolean;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
  // New fields from database schema
  phoneNumber?: string;
  countryCode?: string;
  profileImage?: string;
  bio?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  accountStatus: 'active' | 'inactive' | 'suspended' | 'banned' | 'pending';
  emailVerifiedAt?: Date;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpiresAt?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  lastLoginAt?: Date;
  lastActiveAt?: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  timezone: string;
  locale: string;
  notificationPreferences?: any;
  deletedAt?: Date;
  deletedBy?: string;
  lastPasswordChange?: Date;
  referralCode?: string;
  referredBy?: string;
  registrationIp?: string;
  emailNotifications: boolean;
  smsNotifications: boolean;

  banners?: IBanner[];
  posts?: IPost[];
  projects?: IProject[];
  services?: IService[];
  events?: IEvent[];
  roles?: IRole[];
  token?: string;
}

export const emptyUser: IUser = {
  id: "",
  username: "",
  fullName: "",
  email: "",
  password: "",
  address: "",
  authStrategy: "",
  verified: false,
  role: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  phoneNumber: "",
  countryCode: "",
  profileImage: "",
  bio: "",
  dateOfBirth: undefined,
  gender: undefined,
  accountStatus: 'pending',
  emailVerifiedAt: undefined,
  emailVerificationToken: "",
  passwordResetToken: "",
  passwordResetExpiresAt: undefined,
  twoFactorEnabled: false,
  twoFactorSecret: "",
  lastLoginAt: undefined,
  lastActiveAt: undefined,
  loginAttempts: 0,
  lockedUntil: undefined,
  timezone: 'UTC',
  locale: 'en',
  notificationPreferences: undefined,
  deletedAt: undefined,
  deletedBy: "",
  lastPasswordChange: undefined,
  referralCode: "",
  referredBy: "",
  registrationIp: "",
  emailNotifications: true,
  smsNotifications: false,
};

export interface IUserState extends IBaseState {
  readonly users: IUser[];
  readonly user: IUser;
}
export interface IUserResponse extends IResponseBase {
  data: IUser | null | IUser[];
  message: string;
}
