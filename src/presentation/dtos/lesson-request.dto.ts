// src/presentation/dtos/lesson-request.dto.ts

import { emptyLesson, ILesson } from "@domain/models/lesson";
import { IsNotEmpty, IsNumber, IsString, IsArray } from "class-validator";
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
    };
  }
}
