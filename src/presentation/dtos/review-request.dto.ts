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

  @IsOptional()
  @IsString()
  enrollmentId?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  title!: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 2000)
  comment!: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  pros?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  cons?: string;

  @IsNotEmpty()
  @IsBoolean()
  wouldRecommend!: boolean;

  @IsOptional()
  @IsEnum(['very_easy', 'easy', 'medium', 'hard', 'very_hard'])
  difficulty?: 'very_easy' | 'easy' | 'medium' | 'hard' | 'very_hard';

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  instructorRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  contentQuality?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  valueForMoney?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  completionPercentage!: number;

  @IsOptional()
  @IsBoolean()
  isVerifiedPurchase?: boolean;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected', 'flagged'])
  status?: 'pending' | 'approved' | 'rejected' | 'flagged';

  @IsOptional()
  @IsString()
  moderatorNotes?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  helpfulVotes?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reportedCount?: number;

  @IsOptional()
  @IsEnum(['french', 'english', 'both'])
  language?: 'french' | 'english' | 'both';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

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

  @IsOptional()
  @IsString()
  reason?: string;

  constructor(data: Partial<ReviewReportDto>) {
    Object.assign(this, data);
  }
}
