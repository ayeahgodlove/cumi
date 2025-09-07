import { ICourseEnrollment } from "@domain/models/course-enrollment.model";

export interface CourseEnrollmentDto {
  id: string;
  courseId: string;
  userId: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'dropped' | 'suspended';
  progress: number;
  lastAccessedAt?: string;
  completedAt?: string;
  certificateIssued: boolean;
  certificateUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseEnrollmentDto {
  courseId: string;
  userId: string;
  notes?: string;
}

export interface UpdateCourseEnrollmentDto {
  status?: 'active' | 'completed' | 'dropped' | 'suspended';
  progress?: number;
  notes?: string;
  certificateUrl?: string;
}

export class CourseEnrollmentMapper {
  static toDto(courseEnrollment: ICourseEnrollment): CourseEnrollmentDto {
    return {
      id: courseEnrollment.id,
      courseId: courseEnrollment.courseId,
      userId: courseEnrollment.userId,
      enrollmentDate: courseEnrollment.enrollmentDate.toISOString(),
      status: courseEnrollment.status,
      progress: courseEnrollment.progress,
      lastAccessedAt: courseEnrollment.lastAccessedAt?.toISOString(),
      completedAt: courseEnrollment.completedAt?.toISOString(),
      certificateIssued: courseEnrollment.certificateIssued,
      certificateUrl: courseEnrollment.certificateUrl,
      notes: courseEnrollment.notes,
      createdAt: courseEnrollment.createdAt.toISOString(),
      updatedAt: courseEnrollment.updatedAt.toISOString(),
    };
  }

  static toModel(dto: CreateCourseEnrollmentDto): Partial<ICourseEnrollment> {
    return {
      courseId: dto.courseId,
      userId: dto.userId,
      notes: dto.notes,
    };
  }
}
