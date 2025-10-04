import { emptyModule, IModule } from "@domain/models/module.model";
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsDateString } from "class-validator";
import { nanoid } from "nanoid";

export class ModuleRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsNumber()
  moduleOrder?: number;

  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';

  @IsOptional()
  @IsString()
  learningObjectives?: string;

  @IsOptional()
  @IsString()
  prerequisites?: string;

  @IsOptional()
  @IsNumber()
  estimatedDurationHours?: number;

  @IsOptional()
  @IsBoolean()
  isLocked?: boolean;

  @IsOptional()
  @IsDateString()
  unlockDate?: string;

  @IsOptional()
  @IsNumber()
  totalLessons?: number;

  @IsOptional()
  @IsNumber()
  totalQuizzes?: number;

  @IsOptional()
  @IsNumber()
  totalAssignments?: number;

  constructor(data: IModule) {
    this.title = data.title;
    this.slug = data.slug;
    this.description = data.description;
    this.courseId = data.courseId;
    this.userId = data.userId || undefined;
    this.moduleOrder = data.moduleOrder;
    this.status = data.status;
    this.learningObjectives = data.learningObjectives;
    this.prerequisites = data.prerequisites;
    this.estimatedDurationHours = data.estimatedDurationHours;
    this.isLocked = data.isLocked;
    // Handle unlockDate - it might be a Date object, string, or null
    if (data.unlockDate) {
      if (data.unlockDate instanceof Date) {
        this.unlockDate = data.unlockDate.toISOString();
      } else if (typeof data.unlockDate === 'string') {
        this.unlockDate = data.unlockDate;
      } else {
        // Try to convert to Date and then to ISO string
        try {
          this.unlockDate = new Date(data.unlockDate).toISOString();
        } catch (e) {
          this.unlockDate = undefined;
        }
      }
    } else {
      this.unlockDate = undefined;
    }
    this.totalLessons = data.totalLessons;
    this.totalQuizzes = data.totalQuizzes;
    this.totalAssignments = data.totalAssignments;
  }

  toData(): IModule {
    return {
      ...emptyModule,
      id: nanoid(20),
      title: this.title,
      slug: this.slug,
      description: this.description,
      courseId: this.courseId,
      userId: this.userId || '',
      moduleOrder: this.moduleOrder ?? 1,
      status: this.status ?? 'draft',
      learningObjectives: this.learningObjectives,
      prerequisites: this.prerequisites,
      estimatedDurationHours: this.estimatedDurationHours,
      isLocked: this.isLocked ?? false,
      unlockDate: this.unlockDate ? new Date(this.unlockDate) : undefined,
      totalLessons: this.totalLessons ?? 0,
      totalQuizzes: this.totalQuizzes ?? 0,
      totalAssignments: this.totalAssignments ?? 0,
    };
  }

  toUpdateData(data: IModule): IModule {
    return {
      id: data.id,
      title: this.title,
      slug: this.slug,
      description: this.description,
      courseId: this.courseId,
      userId: this.userId || data.userId,
      moduleOrder: this.moduleOrder ?? data.moduleOrder,
      status: this.status ?? data.status,
      learningObjectives: this.learningObjectives,
      prerequisites: this.prerequisites,
      estimatedDurationHours: this.estimatedDurationHours,
      isLocked: this.isLocked ?? data.isLocked,
      unlockDate: this.unlockDate ? new Date(this.unlockDate) : data.unlockDate,
      totalLessons: this.totalLessons ?? data.totalLessons,
      totalQuizzes: this.totalQuizzes ?? data.totalQuizzes,
      totalAssignments: this.totalAssignments ?? data.totalAssignments,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}

