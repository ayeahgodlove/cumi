import { emptyCourseProgress, ICourseProgress } from "@domain/models/course-progress.model";
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsDateString } from "class-validator";
import { nanoid } from "nanoid";

export class CourseProgressRequestDto {
  @IsNotEmpty()
  @IsString()
  enrollmentId: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  moduleId?: string;

  @IsOptional()
  @IsString()
  lessonId?: string;

  @IsOptional()
  @IsString()
  quizId?: string;

  @IsOptional()
  @IsString()
  assignmentId?: string;

  @IsOptional()
  @IsEnum(['lesson', 'quiz', 'assignment', 'module', 'course'])
  progressType?: 'lesson' | 'quiz' | 'assignment' | 'module' | 'course';

  @IsOptional()
  @IsEnum(['not_started', 'in_progress', 'completed', 'failed', 'skipped'])
  status?: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'skipped';

  @IsOptional()
  @IsNumber()
  completionPercentage?: number;

  @IsOptional()
  @IsNumber()
  timeSpentMinutes?: number;

  @IsOptional()
  @IsDateString()
  startedAt?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsDateString()
  lastAccessedAt?: string;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsNumber()
  maxScore?: number;

  @IsOptional()
  @IsNumber()
  attempts?: number;

  @IsOptional()
  @IsNumber()
  maxAttempts?: number;

  @IsOptional()
  @IsNumber()
  currentPosition?: number;

  @IsOptional()
  @IsNumber()
  totalDuration?: number;

  @IsOptional()
  bookmarks?: any;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(['very_easy', 'easy', 'moderate', 'hard', 'very_hard'])
  difficultyRating?: 'very_easy' | 'easy' | 'moderate' | 'hard' | 'very_hard';

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsString()
  instructorFeedback?: string;

  @IsOptional()
  @IsBoolean()
  isMandatory?: boolean;

  @IsOptional()
  @IsNumber()
  weight?: number;

  constructor(data: ICourseProgress) {
    this.enrollmentId = data.enrollmentId;
    this.courseId = data.courseId;
    this.userId = data.userId || undefined;
    this.moduleId = data.moduleId;
    this.lessonId = data.lessonId;
    this.quizId = data.quizId;
    this.assignmentId = data.assignmentId;
    this.progressType = data.progressType;
    this.status = data.status;
    this.completionPercentage = data.completionPercentage;
    this.timeSpentMinutes = data.timeSpentMinutes;
    this.startedAt = data.startedAt instanceof Date ? data.startedAt.toISOString() : data.startedAt;
    this.completedAt = data.completedAt instanceof Date ? data.completedAt.toISOString() : data.completedAt;
    this.lastAccessedAt = data.lastAccessedAt instanceof Date ? data.lastAccessedAt.toISOString() : data.lastAccessedAt;
    this.score = data.score;
    this.maxScore = data.maxScore;
    this.attempts = data.attempts;
    this.maxAttempts = data.maxAttempts;
    this.currentPosition = data.currentPosition;
    this.totalDuration = data.totalDuration;
    this.bookmarks = data.bookmarks;
    this.notes = data.notes;
    this.difficultyRating = data.difficultyRating;
    this.feedback = data.feedback;
    this.instructorFeedback = data.instructorFeedback;
    this.isMandatory = data.isMandatory;
    this.weight = data.weight;
  }

  toData(): ICourseProgress {
    return {
      ...emptyCourseProgress,
      id: nanoid(20),
      enrollmentId: this.enrollmentId,
      courseId: this.courseId,
      userId: this.userId || '',
      moduleId: this.moduleId,
      lessonId: this.lessonId,
      quizId: this.quizId,
      assignmentId: this.assignmentId,
      progressType: this.progressType ?? 'lesson',
      status: this.status ?? 'not_started',
      completionPercentage: this.completionPercentage ?? 0,
      timeSpentMinutes: this.timeSpentMinutes ?? 0,
      startedAt: this.startedAt ? new Date(this.startedAt) : undefined,
      completedAt: this.completedAt ? new Date(this.completedAt) : undefined,
      lastAccessedAt: this.lastAccessedAt ? new Date(this.lastAccessedAt) : undefined,
      score: this.score,
      maxScore: this.maxScore,
      attempts: this.attempts ?? 0,
      maxAttempts: this.maxAttempts,
      currentPosition: this.currentPosition,
      totalDuration: this.totalDuration,
      bookmarks: this.bookmarks,
      notes: this.notes,
      difficultyRating: this.difficultyRating,
      feedback: this.feedback,
      instructorFeedback: this.instructorFeedback,
      isMandatory: this.isMandatory ?? true,
      weight: this.weight ?? 1.00,
    };
  }

  toUpdateData(data: ICourseProgress): ICourseProgress {
    return {
      id: data.id,
      enrollmentId: this.enrollmentId,
      courseId: this.courseId,
      userId: this.userId || data.userId,
      moduleId: this.moduleId,
      lessonId: this.lessonId,
      quizId: this.quizId,
      assignmentId: this.assignmentId,
      progressType: this.progressType ?? data.progressType,
      status: this.status ?? data.status,
      completionPercentage: this.completionPercentage ?? data.completionPercentage,
      timeSpentMinutes: this.timeSpentMinutes ?? data.timeSpentMinutes,
      startedAt: this.startedAt ? new Date(this.startedAt) : data.startedAt,
      completedAt: this.completedAt ? new Date(this.completedAt) : data.completedAt,
      lastAccessedAt: this.lastAccessedAt ? new Date(this.lastAccessedAt) : data.lastAccessedAt,
      score: this.score,
      maxScore: this.maxScore,
      attempts: this.attempts ?? data.attempts,
      maxAttempts: this.maxAttempts,
      currentPosition: this.currentPosition,
      totalDuration: this.totalDuration,
      bookmarks: this.bookmarks,
      notes: this.notes,
      difficultyRating: this.difficultyRating,
      feedback: this.feedback,
      instructorFeedback: this.instructorFeedback,
      isMandatory: this.isMandatory ?? data.isMandatory,
      weight: this.weight ?? data.weight,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
