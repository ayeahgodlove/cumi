// src/presentation/dtos/quiz-request.dto.ts

import { emptyQuiz, IQuiz } from "@domain/models/quiz";
import { IsArray, IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean, IsEnum, IsDate } from "class-validator";
import { nanoid } from "nanoid";
import slugify from "slugify";

export class QuizRequestDto {
  // Database field order: id, question, answers, slug, userId, lessonId, correctAnswerIndex, created_at, updated_at, title, instructions, quiz_type, points, time_limit_minutes, difficulty, explanation, local_example, pass_required, quiz_order, status, language

  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  answers: string[] | string; // Can be array or JSON string

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsNotEmpty()
  @IsString()
  lessonId: string;

  @IsNotEmpty()
  @IsNumber()
  correctAnswerIndex: number;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsEnum(['multiple_choice', 'true_false', 'fill_blank', 'short_answer', 'essay'])
  quizType?: 'multiple_choice' | 'true_false' | 'fill_blank' | 'short_answer' | 'essay';

  @IsOptional()
  @IsNumber()
  points?: number;

  @IsOptional()
  @IsNumber()
  timeLimitMinutes?: number;

  @IsOptional()
  @IsEnum(['easy', 'medium', 'hard'])
  difficulty?: 'easy' | 'medium' | 'hard';

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsString()
  localExample?: string;

  @IsOptional()
  @IsBoolean()
  passRequired?: boolean;

  @IsOptional()
  @IsNumber()
  quizOrder?: number;

  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';

  @IsOptional()
  @IsEnum(['french', 'english', 'both'])
  language?: 'french' | 'english' | 'both';

  constructor(data: IQuiz) {
    // Database field order: id, question, answers, slug, userId, lessonId, correctAnswerIndex, created_at, updated_at, title, instructions, quiz_type, points, time_limit_minutes, difficulty, explanation, local_example, pass_required, quiz_order, status, language
    
    this.question = data.question;
    this.answers = Array.isArray(data.answers) ? data.answers : JSON.parse((data.answers as any) || "[]");
    this.slug = data.slug;
    this.userId = data.userId || "";
    this.lessonId = data.lessonId;
    this.correctAnswerIndex = data.correctAnswerIndex;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.title = data.title;
    this.instructions = data.instructions;
    this.quizType = data.quizType;
    this.points = data.points;
    this.timeLimitMinutes = data.timeLimitMinutes;
    this.difficulty = data.difficulty;
    this.explanation = data.explanation;
    this.localExample = data.localExample;
    this.passRequired = data.passRequired;
    this.quizOrder = data.quizOrder;
    this.status = data.status;
    this.language = data.language;
  }

  toData(): IQuiz {
    return {
      // Database field order: id, question, answers, slug, userId, lessonId, correctAnswerIndex, created_at, updated_at, title, instructions, quiz_type, points, time_limit_minutes, difficulty, explanation, local_example, pass_required, quiz_order, status, language
      
      ...emptyQuiz,
      id: nanoid(10),
      question: this.question,
      // Stringify answers to match LONGTEXT column in MySQL
      answers: JSON.stringify(this.answers ?? []),
      slug: this.slug || slugify(this.question, { lower: true, replacement: "-" }),
      userId: this.userId || "",
      lessonId: this.lessonId,
      correctAnswerIndex: this.correctAnswerIndex,
      createdAt: this.createdAt || new Date(),
      updatedAt: this.updatedAt || new Date(),
      title: this.title,
      instructions: this.instructions,
      quizType: this.quizType ?? 'multiple_choice',
      points: this.points ?? 1,
      timeLimitMinutes: this.timeLimitMinutes,
      difficulty: this.difficulty ?? 'easy',
      explanation: this.explanation,
      localExample: this.localExample,
      passRequired: this.passRequired ?? false,
      quizOrder: this.quizOrder ?? 1,
      status: this.status ?? 'draft',
      language: this.language ?? 'both',
    };
  }

  toUpdateData(data: IQuiz): IQuiz {
    return {
      // Database field order: id, question, answers, slug, userId, lessonId, correctAnswerIndex, created_at, updated_at, title, instructions, quiz_type, points, time_limit_minutes, difficulty, explanation, local_example, pass_required, quiz_order, status, language
      
      id: data.id,
      question: this.question ?? data.question,
      answers: this.answers ? JSON.stringify(this.answers) : data.answers,
      slug: this.slug ?? data.slug,
      userId: data.userId, // Preserve original userId
      lessonId: this.lessonId ?? data.lessonId,
      correctAnswerIndex: this.correctAnswerIndex ?? data.correctAnswerIndex,
      createdAt: data.createdAt, // Preserve original creation time
      updatedAt: new Date(), // Update timestamp
      title: this.title ?? data.title,
      instructions: this.instructions ?? data.instructions,
      quizType: this.quizType ?? data.quizType,
      points: this.points ?? data.points,
      timeLimitMinutes: this.timeLimitMinutes ?? data.timeLimitMinutes,
      difficulty: this.difficulty ?? data.difficulty,
      explanation: this.explanation ?? data.explanation,
      localExample: this.localExample ?? data.localExample,
      passRequired: this.passRequired ?? data.passRequired,
      quizOrder: this.quizOrder ?? data.quizOrder,
      status: this.status ?? data.status,
      language: this.language ?? data.language,
    };
  }
}
