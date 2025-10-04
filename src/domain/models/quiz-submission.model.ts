// src/domain/models/quiz-submission.model.ts

export interface IQuizSubmission {
  id: string;
  userId: string;
  quizId: string;
  lessonId: string;
  courseId: string;
  moduleId?: string;
  score: number;
  maxScore: number;
  percentage: number;
  answers: string; // JSON array
  correctAnswers: string; // JSON array
  timeSpentSeconds?: number;
  attemptNumber: number;
  isPassed: boolean;
  submittedAt: Date;
  gradedAt?: Date;
  status: 'submitted' | 'graded' | 'review';
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const emptyQuizSubmission: IQuizSubmission = {
  id: "",
  userId: "",
  quizId: "",
  lessonId: "",
  courseId: "",
  moduleId: "",
  score: 0,
  maxScore: 0,
  percentage: 0,
  answers: "[]",
  correctAnswers: "[]",
  timeSpentSeconds: 0,
  attemptNumber: 1,
  isPassed: false,
  submittedAt: new Date(),
  gradedAt: undefined,
  status: 'graded',
  feedback: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

