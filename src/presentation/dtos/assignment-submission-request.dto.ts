// src/presentation/dtos/assignment-submission-request.dto.ts

import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional, Min, Max, IsEnum, IsArray, Length } from "class-validator";

export class AssignmentSubmissionRequestDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  assignmentId!: string;

  @IsNotEmpty()
  @IsString()
  courseId!: string;

  @IsOptional()
  @IsString()
  moduleId?: string;

  @IsOptional()
  @IsString()
  lessonId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10000)
  submissionText?: string;

  @IsOptional()
  @IsString()
  fileUrls?: string; // JSON array

  @IsOptional()
  @IsNumber()
  @Min(0)
  score?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  maxScore!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  attemptNumber?: number;

  @IsOptional()
  @IsBoolean()
  isPassed?: boolean;

  @IsOptional()
  @IsBoolean()
  isLate?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  latePenaltyApplied?: number;

  @IsOptional()
  @IsString()
  gradedBy?: string;

  @IsOptional()
  @IsEnum(['submitted', 'graded', 'returned', 'resubmitted'])
  status?: 'submitted' | 'graded' | 'returned' | 'resubmitted';

  @IsOptional()
  @IsString()
  instructorFeedback?: string;

  @IsOptional()
  @IsString()
  rubricScores?: string; // JSON object

  @IsOptional()
  @IsString()
  peerReviewScores?: string; // JSON array

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  plagiarismScore?: number;

  constructor(data: Partial<AssignmentSubmissionRequestDto>) {
    Object.assign(this, data);
  }
}

export class AssignmentGradeDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  score!: number;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsString()
  gradedBy?: string;

  @IsOptional()
  @IsString()
  rubricScores?: string; // JSON object

  constructor(data: Partial<AssignmentGradeDto>) {
    Object.assign(this, data);
  }
}

export class AssignmentSubmissionUpdateDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  submissionText?: string;

  @IsOptional()
  @IsString()
  fileUrls?: string; // JSON array

  @IsOptional()
  @IsEnum(['submitted', 'graded', 'returned', 'resubmitted'])
  status?: 'submitted' | 'graded' | 'returned' | 'resubmitted';

  constructor(data: Partial<AssignmentSubmissionUpdateDto>) {
    Object.assign(this, data);
  }
}

