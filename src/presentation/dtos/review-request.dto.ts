// src/presentation/dtos/review-request.dto.ts

import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional, Min, Max, IsEnum, IsArray, Length } from "class-validator";

export class ReviewRequestDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  courseId!: string;


  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsNotEmpty()
  @IsString()
  @Length(10, 2000)
  comment!: string;


  @IsNotEmpty()
  @IsBoolean()
  wouldRecommend!: boolean;

  @IsOptional()
  @IsEnum(['very_easy', 'easy', 'medium', 'hard', 'very_hard'])
  difficulty?: 'very_easy' | 'easy' | 'medium' | 'hard' | 'very_hard';


  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected', 'flagged'])
  status?: 'pending' | 'approved' | 'rejected' | 'flagged';

  @IsOptional()
  @IsNumber()
  @Min(0)
  helpfulVotes?: number;


  @IsOptional()
  @IsEnum(['french', 'english', 'both'])
  language?: 'french' | 'english' | 'both';


  constructor(data: Partial<ReviewRequestDto>) {
    Object.assign(this, data);
  }
}

export class ReviewUpdateStatusDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsEnum(['pending', 'approved', 'rejected', 'flagged'])
  status!: 'pending' | 'approved' | 'rejected' | 'flagged';

  @IsOptional()
  @IsString()
  moderatorNotes?: string;

  constructor(data: Partial<ReviewUpdateStatusDto>) {
    Object.assign(this, data);
  }
}

export class ReviewHelpfulVoteDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  userId!: string;

  constructor(data: Partial<ReviewHelpfulVoteDto>) {
    Object.assign(this, data);
  }
}

export class ReviewReportDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  reason!: string;

  constructor(data: Partial<ReviewReportDto>) {
    Object.assign(this, data);
  }
}

