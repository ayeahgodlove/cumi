// src/presentation/dtos/course-request.dto.ts

import { emptyCourse, ICourse } from "@domain/models/course";
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean, IsEnum } from "class-validator";
import { nanoid } from "nanoid";
import slugify from "slugify";

export class CourseRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  authorName: string;

  @IsNotEmpty()
  @IsString()
  categoryId;

  @IsNotEmpty()
  @IsString()
  imageUrl;

  // New fields from database schema
  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsEnum(['draft', 'published', 'archived', 'suspended'])
  status?: 'draft' | 'published' | 'archived' | 'suspended';

  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  level?: 'beginner' | 'intermediate' | 'advanced';

  @IsOptional()
  @IsNumber()
  durationWeeks?: number;

  @IsOptional()
  @IsNumber()
  maxStudents?: number;

  @IsOptional()
  @IsEnum(['french', 'english', 'both', 'fulfulde', 'ewondo'])
  language?: 'french' | 'english' | 'both' | 'fulfulde' | 'ewondo';

  @IsOptional()
  @IsEnum(['students', 'professionals', 'entrepreneurs', 'farmers', 'teachers', 'youth', 'women'])
  targetAudience?: 'students' | 'professionals' | 'entrepreneurs' | 'farmers' | 'teachers' | 'youth' | 'women';

  @IsOptional()
  @IsBoolean()
  certificateAvailable?: boolean;

  @IsOptional()
  @IsString()
  prerequisites?: string;

  @IsOptional()
  @IsString()
  learningOutcomes?: string;

  @IsOptional()
  @IsString()
  instructorContact?: string;

  constructor(data: ICourse) {
    this.title = data.title;
    this.description = data.description;
    this.authorName = data.authorName;
    this.categoryId = data.categoryId;
    this.imageUrl = data.imageUrl;
    this.price = data.price;
    this.isFree = data.isFree;
    this.currency = data.currency;
    this.status = data.status;
    this.level = data.level;
    this.durationWeeks = data.durationWeeks;
    this.maxStudents = data.maxStudents;
    this.language = data.language;
    this.targetAudience = data.targetAudience;
    this.certificateAvailable = data.certificateAvailable;
    this.prerequisites = data.prerequisites;
    this.learningOutcomes = data.learningOutcomes;
    this.instructorContact = data.instructorContact;
  }

  toData(): ICourse {
    return {
      ...emptyCourse,
      id: nanoid(10),
      title: this.title,
      description: this.description,
      authorName: this.authorName,
      categoryId: this.categoryId,
      slug: slugify(this.title, { lower: true, replacement: "-" }),
      imageUrl: this.imageUrl,
      price: this.price ?? 0,
      isFree: this.isFree ?? true,
      currency: this.currency ?? 'XAF',
      status: this.status ?? 'draft',
      level: this.level ?? 'beginner',
      durationWeeks: this.durationWeeks,
      maxStudents: this.maxStudents,
      language: this.language ?? 'both',
      targetAudience: this.targetAudience,
      certificateAvailable: this.certificateAvailable ?? false,
      prerequisites: this.prerequisites,
      learningOutcomes: this.learningOutcomes,
      instructorContact: this.instructorContact,
      // userId will be set by the API route
    };
  }

  toUpdateData(data: ICourse): ICourse {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      authorName: data.authorName,
      imageUrl: data.imageUrl,
      categoryId: data.categoryId,
      slug: data.slug,
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      price: data.price,
      isFree: data.isFree,
      currency: data.currency,
      status: data.status,
      level: data.level,
      durationWeeks: data.durationWeeks,
      maxStudents: data.maxStudents,
      currentStudents: data.currentStudents,
      language: data.language,
      targetAudience: data.targetAudience,
      certificateAvailable: data.certificateAvailable,
      prerequisites: data.prerequisites,
      learningOutcomes: data.learningOutcomes,
      instructorContact: data.instructorContact,
    };
  }
}

