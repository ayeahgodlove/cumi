// src/presentation/dtos/lesson-request.dto.ts

import { emptyLesson, ILesson } from "@domain/models/lesson";
import { IsNotEmpty, IsNumber, IsString, IsArray, IsOptional, IsBoolean, IsEnum, IsDate } from "class-validator";
import { nanoid } from "nanoid";
import slugify from "slugify";

export class LessonRequestDto {
  // Database insertion order: id, title, slug, description, content, imageUrl, userId, courseId, moduleId, authorName, difficulty, prerequisites, objectives, keywords, reviews, language, rating, created_at, updated_at, duration_minutes, lesson_order, status, lesson_type, video_url, audio_url, download_materials, is_free_preview, requires_completion, estimated_completion_time, practical_examples, resources_needed

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsNotEmpty()
  @IsString()
  moduleId: string;

  @IsNotEmpty()
  @IsString()
  authorName: string;

  @IsNotEmpty()
  @IsString()
  difficulty: string;

  @IsNotEmpty()
  @IsArray()
  prerequisites: string[];

  @IsNotEmpty()
  @IsArray()
  objectives: string[];

  @IsNotEmpty()
  @IsArray()
  keywords: string[];

  @IsOptional()
  reviews?: string[];

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsOptional()
  @IsNumber()
  durationMinutes?: number;

  @IsOptional()
  @IsNumber()
  lessonOrder?: number;

  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';

  @IsOptional()
  @IsEnum(['video', 'text', 'audio', 'practical', 'discussion', 'assignment'])
  lessonType?: 'video' | 'text' | 'audio' | 'practical' | 'discussion' | 'assignment';

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  downloadMaterials?: string;

  @IsOptional()
  @IsBoolean()
  isFreePreview?: boolean;

  @IsOptional()
  @IsBoolean()
  requiresCompletion?: boolean;

  @IsOptional()
  @IsNumber()
  estimatedCompletionTime?: number;

  @IsOptional()
  @IsString()
  practicalExamples?: string;

  @IsOptional()
  @IsString()
  resourcesNeeded?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  constructor(data: ILesson) {
    // Database insertion order: id, title, slug, description, content, imageUrl, userId, courseId, moduleId, authorName, difficulty, prerequisites, objectives, keywords, reviews, language, rating, created_at, updated_at, duration_minutes, lesson_order, status, lesson_type, video_url, audio_url, download_materials, is_free_preview, requires_completion, estimated_completion_time, practical_examples, resources_needed
    
    this.title = data.title;
    this.description = data.description;
    this.content = data.content;
    this.imageUrl = data.imageUrl;
    this.userId = data.userId;
    this.courseId = data.courseId;
    this.moduleId = data.moduleId || "";
    this.authorName = data.authorName || "";
    this.difficulty = data.difficulty;
    this.prerequisites = Array.isArray(data.prerequisites)
      ? data.prerequisites
      : JSON.parse((data.prerequisites as any) || "[]");
    this.objectives = Array.isArray(data.objectives)
      ? data.objectives
      : JSON.parse((data.objectives as any) || "[]");
    this.keywords = Array.isArray(data.keywords)
      ? data.keywords
      : JSON.parse((data.keywords as any) || "[]");
    this.reviews = Array.isArray(data.reviews) ? data.reviews : [];
    this.language = data.language;
    this.rating = data.rating;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.durationMinutes = data.durationMinutes;
    this.lessonOrder = data.lessonOrder;
    this.status = data.status;
    this.lessonType = data.lessonType;
    this.videoUrl = data.videoUrl;
    this.audioUrl = data.audioUrl;
    this.downloadMaterials = data.downloadMaterials;
    this.isFreePreview = data.isFreePreview;
    this.requiresCompletion = data.requiresCompletion;
    this.estimatedCompletionTime = data.estimatedCompletionTime;
    this.practicalExamples = Array.isArray(data.practicalExamples)
      ? (data.practicalExamples as any[]).join("\n")
      : (data.practicalExamples as any);
    this.resourcesNeeded = Array.isArray(data.resourcesNeeded)
      ? (data.resourcesNeeded as any[]).join("\n")
      : (data.resourcesNeeded as any);
    this.slug = data.slug;
  }

  toData(): ILesson {
    return {
      // Database insertion order: id, title, slug, description, content, imageUrl, userId, courseId, moduleId, authorName, difficulty, prerequisites, objectives, keywords, reviews, language, rating, created_at, updated_at, duration_minutes, lesson_order, status, lesson_type, video_url, audio_url, download_materials, is_free_preview, requires_completion, estimated_completion_time, practical_examples, resources_needed
      
      ...emptyLesson,
      id: nanoid(10),
      title: this.title,
      slug: this.slug || slugify(this.title, { lower: true, replacement: "-" }),
      description: this.description,
      content: this.content,
      imageUrl: this.imageUrl,
      userId: this.userId,
      courseId: this.courseId,
      moduleId: this.moduleId,
      authorName: this.authorName,
      difficulty: this.difficulty,
      // Stringify arrays to match LONGTEXT columns in MySQL
      prerequisites: JSON.stringify(this.prerequisites ?? []),
      objectives: JSON.stringify(this.objectives ?? []),
      keywords: JSON.stringify(this.keywords ?? []),
      reviews: JSON.stringify(this.reviews ?? []),
      language: this.language,
      rating: this.rating,
      createdAt: this.createdAt || new Date(),
      updatedAt: this.updatedAt || new Date(),
      durationMinutes: this.durationMinutes,
      lessonOrder: this.lessonOrder ?? 1,
      status: this.status ?? 'draft',
      lessonType: this.lessonType ?? 'text',
      videoUrl: this.videoUrl,
      audioUrl: this.audioUrl,
      downloadMaterials: this.downloadMaterials,
      isFreePreview: this.isFreePreview ?? false,
      requiresCompletion: this.requiresCompletion ?? true,
      estimatedCompletionTime: this.estimatedCompletionTime,
      practicalExamples: this.practicalExamples,
      resourcesNeeded: this.resourcesNeeded,
    };
  }

  toUpdateData(data: ILesson): ILesson {
    return {
      // Database insertion order: id, title, slug, description, content, imageUrl, userId, courseId, moduleId, authorName, difficulty, prerequisites, objectives, keywords, reviews, language, rating, created_at, updated_at, duration_minutes, lesson_order, status, lesson_type, video_url, audio_url, download_materials, is_free_preview, requires_completion, estimated_completion_time, practical_examples, resources_needed
      
      id: data.id,
      title: this.title ?? data.title,
      slug: this.slug ?? data.slug,
      description: this.description ?? data.description,
      content: this.content ?? data.content,
      imageUrl: this.imageUrl ?? data.imageUrl,
      userId: data.userId, // Preserve original userId
      courseId: this.courseId ?? data.courseId,
      moduleId: this.moduleId ?? data.moduleId,
      authorName: this.authorName ?? data.authorName,
      difficulty: this.difficulty ?? data.difficulty,
      prerequisites: this.prerequisites ?? data.prerequisites,
      objectives: this.objectives ?? data.objectives,
      keywords: this.keywords ?? data.keywords,
      reviews: this.reviews ?? data.reviews,
      language: this.language ?? data.language,
      rating: this.rating ?? data.rating,
      createdAt: data.createdAt, // Preserve original creation time
      updatedAt: new Date(), // Update timestamp
      durationMinutes: this.durationMinutes ?? data.durationMinutes,
      lessonOrder: this.lessonOrder ?? data.lessonOrder,
      status: this.status ?? data.status,
      lessonType: this.lessonType ?? data.lessonType,
      videoUrl: this.videoUrl ?? data.videoUrl,
      audioUrl: this.audioUrl ?? data.audioUrl,
      downloadMaterials: this.downloadMaterials ?? data.downloadMaterials,
      isFreePreview: this.isFreePreview ?? data.isFreePreview,
      requiresCompletion: this.requiresCompletion ?? data.requiresCompletion,
      estimatedCompletionTime: this.estimatedCompletionTime ?? data.estimatedCompletionTime,
      practicalExamples: this.practicalExamples ?? data.practicalExamples,
      resourcesNeeded: this.resourcesNeeded ?? data.resourcesNeeded,
    };
  }
}