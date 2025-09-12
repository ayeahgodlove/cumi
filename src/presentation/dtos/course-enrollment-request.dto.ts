// src/presentation/dtos/course-enrollment-request.dto.ts

import { emptyCourseEnrollment, ICourseEnrollment } from "@domain/models/course-enrollment.model";
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsDateString } from "class-validator";
import { nanoid } from "nanoid";

export class CourseEnrollmentRequestDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(['active', 'completed', 'dropped', 'suspended'])
  status?: 'active' | 'completed' | 'dropped' | 'suspended';

  @IsOptional()
  @IsNumber()
  progress?: number;

  @IsOptional()
  @IsDateString()
  lastAccessedAt?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsBoolean()
  certificateIssued?: boolean;

  @IsOptional()
  @IsString()
  certificateUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  // New fields from database schema
  @IsOptional()
  @IsEnum(['pending', 'paid', 'partial', 'free', 'scholarship'])
  paymentStatus?: 'pending' | 'paid' | 'partial' | 'free' | 'scholarship';

  @IsOptional()
  @IsEnum(['mobile_money', 'bank_transfer', 'cash', 'scholarship', 'free'])
  paymentMethod?: 'mobile_money' | 'bank_transfer' | 'cash' | 'scholarship' | 'free';

  @IsOptional()
  @IsNumber()
  amountPaid?: number;

  @IsOptional()
  @IsString()
  paymentReference?: string;

  @IsOptional()
  @IsString()
  studentPhone?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @IsOptional()
  @IsEnum(['primary', 'secondary', 'university', 'professional', 'other'])
  educationLevel?: 'primary' | 'secondary' | 'university' | 'professional' | 'other';

  @IsOptional()
  @IsString()
  motivation?: string;

  @IsOptional()
  @IsString()
  offlineProgress?: string;

  @IsOptional()
  @IsString()
  studyGroup?: string;

  @IsOptional()
  @IsString()
  mentorAssigned?: string;

  @IsOptional()
  @IsDateString()
  completionTargetDate?: string;

  @IsOptional()
  @IsEnum(['high_speed', 'mobile_data', 'limited', 'cybercafe'])
  internetAccess?: 'high_speed' | 'mobile_data' | 'limited' | 'cybercafe';

  @IsOptional()
  @IsEnum(['whatsapp', 'sms', 'call', 'email'])
  preferredContact?: 'whatsapp' | 'sms' | 'call' | 'email';

  @IsOptional()
  @IsEnum(['morning', 'afternoon', 'evening', 'weekend', 'flexible'])
  studySchedule?: 'morning' | 'afternoon' | 'evening' | 'weekend' | 'flexible';

  @IsOptional()
  @IsString()
  certificateName?: string;

  @IsOptional()
  @IsEnum(['french', 'english', 'both'])
  certificateLanguage?: 'french' | 'english' | 'both';

  @IsOptional()
  @IsString()
  skillsGained?: string;

  constructor(data: ICourseEnrollment) {
    this.courseId = data.courseId;
    this.userId = data.userId || undefined;
    this.status = data.status;
    this.progress = data.progress;
    this.lastAccessedAt = data.lastAccessedAt?.toISOString();
    this.completedAt = data.completedAt?.toISOString();
    this.certificateIssued = data.certificateIssued;
    this.certificateUrl = data.certificateUrl;
    this.notes = data.notes;
    this.paymentStatus = data.paymentStatus;
    this.paymentMethod = data.paymentMethod;
    this.amountPaid = data.amountPaid;
    this.paymentReference = data.paymentReference;
    this.studentPhone = data.studentPhone;
    this.emergencyContact = data.emergencyContact;
    this.educationLevel = data.educationLevel;
    this.motivation = data.motivation;
    this.offlineProgress = data.offlineProgress;
    this.studyGroup = data.studyGroup;
    this.mentorAssigned = data.mentorAssigned;
    this.completionTargetDate = data.completionTargetDate?.toISOString();
    this.internetAccess = data.internetAccess;
    this.preferredContact = data.preferredContact;
    this.studySchedule = data.studySchedule;
    this.certificateName = data.certificateName;
    this.certificateLanguage = data.certificateLanguage;
    this.skillsGained = data.skillsGained;
  }

  toData(): ICourseEnrollment {
    return {
      ...emptyCourseEnrollment,
      id: nanoid(20),
      courseId: this.courseId,
      userId: this.userId || '', // Will be overridden by API with session userId
      enrollmentDate: new Date(),
      status: this.status ?? 'active',
      progress: this.progress ?? 0,
      lastAccessedAt: this.lastAccessedAt ? new Date(this.lastAccessedAt) : undefined,
      completedAt: this.completedAt ? new Date(this.completedAt) : undefined,
      certificateIssued: this.certificateIssued ?? false,
      certificateUrl: this.certificateUrl,
      notes: this.notes,
      paymentStatus: this.paymentStatus ?? 'free',
      paymentMethod: this.paymentMethod ?? 'free',
      amountPaid: this.amountPaid ?? 0,
      paymentReference: this.paymentReference,
      studentPhone: this.studentPhone,
      emergencyContact: this.emergencyContact,
      educationLevel: this.educationLevel,
      motivation: this.motivation,
      offlineProgress: this.offlineProgress,
      studyGroup: this.studyGroup,
      mentorAssigned: this.mentorAssigned,
      completionTargetDate: this.completionTargetDate ? new Date(this.completionTargetDate) : undefined,
      internetAccess: this.internetAccess,
      preferredContact: this.preferredContact ?? 'whatsapp',
      studySchedule: this.studySchedule,
      certificateName: this.certificateName,
      certificateLanguage: this.certificateLanguage ?? 'both',
      skillsGained: this.skillsGained,
    };
  }

  toUpdateData(data: ICourseEnrollment): ICourseEnrollment {
    return {
      id: data.id,
      courseId: data.courseId,
      userId: data.userId,
      enrollmentDate: data.enrollmentDate,
      status: data.status,
      progress: data.progress,
      lastAccessedAt: data.lastAccessedAt,
      completedAt: data.completedAt,
      certificateIssued: data.certificateIssued,
      certificateUrl: data.certificateUrl,
      notes: data.notes,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      paymentStatus: data.paymentStatus,
      paymentMethod: data.paymentMethod,
      amountPaid: data.amountPaid,
      paymentReference: data.paymentReference,
      studentPhone: data.studentPhone,
      emergencyContact: data.emergencyContact,
      educationLevel: data.educationLevel,
      motivation: data.motivation,
      offlineProgress: data.offlineProgress,
      studyGroup: data.studyGroup,
      mentorAssigned: data.mentorAssigned,
      completionTargetDate: data.completionTargetDate,
      internetAccess: data.internetAccess,
      preferredContact: data.preferredContact,
      studySchedule: data.studySchedule,
      certificateName: data.certificateName,
      certificateLanguage: data.certificateLanguage,
      skillsGained: data.skillsGained,
    };
  }
}
