// src/domain/models/quiz.ts

import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IQuiz {
  // Database field order: id, question, answers, slug, userId, lessonId, correctAnswerIndex, created_at, updated_at, title, instructions, quiz_type, points, time_limit_minutes, difficulty, explanation, local_example, pass_required, quiz_order, status, language
  
  id: string;
  question: string;
  answers: string[] | string; // Can be array or JSON string
  slug: string;
  userId?: string;
  lessonId: string;
  correctAnswerIndex: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  instructions?: string;
  quizType: 'multiple_choice' | 'true_false' | 'fill_blank' | 'short_answer' | 'essay';
  points: number;
  timeLimitMinutes?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
  localExample?: string;
  passRequired: boolean;
  quizOrder: number;
  status: 'draft' | 'published' | 'archived';
  language: 'french' | 'english' | 'both';
}

export const emptyQuiz: IQuiz = {
  id: "",
  question: "",
  answers: [],
  slug: "",
  userId: "",
  lessonId: "",
  correctAnswerIndex: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  title: "",
  instructions: "",
  quizType: 'multiple_choice',
  points: 1,
  timeLimitMinutes: undefined,
  difficulty: 'easy',
  explanation: "",
  localExample: "",
  passRequired: false,
  quizOrder: 1,
  status: 'draft',
  language: 'both',
};

export interface IQuizState extends IBaseState {
  readonly quizes: IQuiz[];
  readonly quiz: IQuiz;
}

export interface IQuizResponse extends IResponseBase {
  data: IQuiz;
}

export interface IQuizResponses extends IResponseBase {
  data: IQuiz[];
}
