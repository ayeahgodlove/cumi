import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface ICourseEnrollment {
  id: string;
  courseId: string;
  userId: string;
  enrollmentDate: Date;
  status: 'active' | 'completed' | 'dropped' | 'suspended';
  progress: number; // 0-100
  lastAccessedAt?: Date;
  completedAt?: Date;
  certificateIssued: boolean;
  certificateUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  // New fields from database schema
  paymentStatus: 'pending' | 'paid' | 'partial' | 'free' | 'scholarship';
  paymentMethod?: 'mobile_money' | 'bank_transfer' | 'cash' | 'scholarship' | 'free';
  amountPaid: number;
  paymentReference?: string;
  studentPhone?: string;
  emergencyContact?: string;
  educationLevel?: 'primary' | 'secondary' | 'university' | 'professional' | 'other';
  motivation?: string;
  offlineProgress?: string;
  studyGroup?: string;
  mentorAssigned?: string;
  completionTargetDate?: Date;
  internetAccess?: 'high_speed' | 'mobile_data' | 'limited' | 'cybercafe';
  preferredContact: 'whatsapp' | 'sms' | 'call' | 'email';
  studySchedule?: 'morning' | 'afternoon' | 'evening' | 'weekend' | 'flexible';
  certificateName?: string;
  certificateLanguage: 'french' | 'english' | 'both';
  skillsGained?: string;
}

export const emptyCourseEnrollment: ICourseEnrollment = {
  id: "",
  courseId: "",
  userId: "",
  enrollmentDate: new Date(),
  status: 'active',
  progress: 0,
  lastAccessedAt: undefined,
  completedAt: undefined,
  certificateIssued: false,
  certificateUrl: "",
  notes: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  paymentStatus: 'free',
  paymentMethod: 'free',
  amountPaid: 0,
  paymentReference: "",
  studentPhone: "",
  emergencyContact: "",
  educationLevel: undefined,
  motivation: "",
  offlineProgress: "",
  studyGroup: "",
  mentorAssigned: "",
  completionTargetDate: undefined,
  internetAccess: undefined,
  preferredContact: 'whatsapp',
  studySchedule: undefined,
  certificateName: "",
  certificateLanguage: 'both',
  skillsGained: "",
};

export interface ICourseEnrollmentState extends IBaseState {
  readonly enrollments: ICourseEnrollment[];
  readonly enrollment: ICourseEnrollment;
}

export interface ICourseEnrollmentResponse extends IResponseBase {
  data: ICourseEnrollment;
}

export interface ICourseEnrollmentResponses extends IResponseBase {
  data: ICourseEnrollment[];
}