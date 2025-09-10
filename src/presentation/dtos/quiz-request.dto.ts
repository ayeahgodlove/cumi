// src/presentation/dtos/quiz-request.dto.ts

import { emptyQuiz, IQuiz } from "@domain/models/quiz";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { nanoid } from "nanoid";
import slugify from "slugify";

export class QuizRequestDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsString()
  lessonId: string;

  @IsNotEmpty()
  @IsArray()
  answers: string[];

  @IsNotEmpty()
  @IsNumber()
  correctAnswerIndex: number;

  constructor(data: IQuiz) {
    this.question = data.question;
    this.answers = data.answers;
    this.correctAnswerIndex = data.correctAnswerIndex;
    this.lessonId = data.lessonId;
  }

  toData(): IQuiz {
    return {
      ...emptyQuiz,
      id: nanoid(10),
      question: this.question,
      answers: this.answers,
      correctAnswerIndex: this.correctAnswerIndex,
      lessonId: this.lessonId,
      slug: slugify(this.question, { lower: true, replacement: "-" }),
      // userId will be set by the API route
    };
  }

  toUpdateData(data: IQuiz): IQuiz {
    return {
      id: data.id,
      question: data.question,
      answers: data.answers,
      correctAnswerIndex: data.correctAnswerIndex,
      lessonId: data.lessonId,
      slug: data.slug
    };
  }
}
