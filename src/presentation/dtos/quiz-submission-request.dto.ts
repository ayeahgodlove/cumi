// src/presentation/dtos/quiz-submission-request.dto.ts

import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional, Min, Max, IsEnum, IsArray, IsJSON } from "class-validator";

export class QuizSubmissionRequestDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  quizId!: string;

  @IsNotEmpty()
  @IsString()
  lessonId!: string;

  @IsNotEmpty()
  @IsString()
  courseId!: string;

  @IsOptional()
  @IsString()
  moduleId?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  score!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  maxScore!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage!: number;

  @IsNotEmpty()
  @IsString()
  answers!: string; // JSON array

  @IsNotEmpty()
  @IsString()
  correctAnswers!: string; // JSON array

  @IsOptional()
  @IsNumber()
  @Min(0)
  timeSpentSeconds?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  attemptNumber?: number;

  @IsOptional()
  @IsBoolean()
  isPassed?: boolean;

  @IsOptional()
  @IsEnum(['submitted', 'graded', 'review'])
  status?: 'submitted' | 'graded' | 'review';

  @IsOptional()
  @IsString()
  feedback?: string;

  constructor(data: Partial<QuizSubmissionRequestDto>) {
    Object.assign(this, data);
  }
}

export class QuizSubmissionUpdateDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  score?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage?: number;

  @IsOptional()
  @IsBoolean()
  isPassed?: boolean;

  @IsOptional()
  @IsEnum(['submitted', 'graded', 'review'])
  status?: 'submitted' | 'graded' | 'review';

  @IsOptional()
  @IsString()
  feedback?: string;

  constructor(data: Partial<QuizSubmissionUpdateDto>) {
    Object.assign(this, data);
  }
}
