// src/presentation/dtos/lesson-request.dto.ts

import { emptyLesson, ILesson } from "@domain/models/lesson";
import { IsNotEmpty, IsNumber, IsString, IsArray, IsOptional, IsBoolean, IsEnum } from "class-validator";
import { nanoid } from "nanoid";
import slugify from "slugify";

export class LessonRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsNotEmpty()
  @IsString()
  difficulty: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsArray()
  prerequisites: string[];

  @IsNotEmpty()
  @IsArray()
  objectives: string[];

  @IsNotEmpty()
  @IsArray()
  keywords: string[];

  @IsNotEmpty()
  @IsString()
  courseId: string;

  url: string;

  // New fields from database schema
  @IsOptional()
  @IsString()
  authorName?: string;

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
  language?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsArray()
  reviews?: string[];

  constructor(data: ILesson) {
    this.title = data.title;
    this.description = data.description;
    this.imageUrl = data.imageUrl;
    this.content = data.content;
    this.duration = data.duration;
    this.difficulty = data.difficulty;
    this.prerequisites = data.prerequisites;
    this.objectives = data.objectives;
    this.keywords = data.keywords;
    this.author = data.author;
    this.courseId = data.courseId;
    this.url = data.url;
    this.authorName = data.authorName;
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
    this.practicalExamples = data.practicalExamples;
    this.resourcesNeeded = data.resourcesNeeded;
    this.language = data.language;
    this.rating = data.rating;
    this.reviews = data.reviews;
  }

  toData(): ILesson {
    return {
      ...emptyLesson,
      id: nanoid(10),
      title: this.title,
      description: this.description,
      imageUrl: this.imageUrl,
      content: this.content,
      difficulty: this.difficulty,
      duration: this.duration,
      prerequisites: this.prerequisites,
      objectives: this.objectives,
      keywords: this.keywords,
      author: this.author,
      courseId: this.courseId,
      url: this.url,
      slug: slugify(this.title, { lower: true, replacement: "-" }),
      authorName: this.authorName ?? "",
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
      language: this.language,
      rating: this.rating,
      reviews: this.reviews,
      // userId will be set by the API route
    };
  }

  toUpdateData(data: ILesson): ILesson {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      userId: data.userId,
      content: data.content,
      duration: data.duration,
      prerequisites: data.prerequisites,
      objectives: data.objectives,
      keywords: data.keywords,
      difficulty: data.difficulty,
      author: data.author,
      courseId: data.courseId,
      url: data.url,
      slug: data.slug,
      imageUrl: data.imageUrl,
      authorName: data.authorName,
      durationMinutes: data.durationMinutes,
      lessonOrder: data.lessonOrder,
      status: data.status,
      lessonType: data.lessonType,
      videoUrl: data.videoUrl,
      audioUrl: data.audioUrl,
      downloadMaterials: data.downloadMaterials,
      isFreePreview: data.isFreePreview,
      requiresCompletion: data.requiresCompletion,
      estimatedCompletionTime: data.estimatedCompletionTime,
      practicalExamples: data.practicalExamples,
      resourcesNeeded: data.resourcesNeeded,
      language: data.language,
      rating: data.rating,
      reviews: data.reviews,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
