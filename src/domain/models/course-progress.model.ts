import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface ICourseProgress {
  id: string;
  enrollmentId: string;
  courseId: string;
  userId: string;
  moduleId?: string;
  lessonId?: string;
  quizId?: string;
  assignmentId?: string;
  progressType: 'lesson' | 'quiz' | 'assignment' | 'module' | 'course';
  status: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  completionPercentage: number;
  timeSpentMinutes: number;
  startedAt?: Date;
  completedAt?: Date;
  lastAccessedAt?: Date;
  score?: number;
  maxScore?: number;
  attempts: number;
  maxAttempts?: number;
  currentPosition?: number;
  totalDuration?: number;
  bookmarks?: any;
  notes?: string;
  difficultyRating?: 'very_easy' | 'easy' | 'moderate' | 'hard' | 'very_hard';
  feedback?: string;
  instructorFeedback?: string;
  isMandatory: boolean;
  weight: number;
  createdAt: Date;
  updatedAt: Date;
}

export const emptyCourseProgress: ICourseProgress = {
  id: "",
  enrollmentId: "",
  courseId: "",
  userId: "",
  moduleId: "",
  lessonId: "",
  quizId: "",
  assignmentId: "",
  progressType: 'lesson',
  status: 'not_started',
  completionPercentage: 0,
  timeSpentMinutes: 0,
  startedAt: undefined,
  completedAt: undefined,
  lastAccessedAt: undefined,
  score: 0,
  maxScore: 0,
  attempts: 0,
  maxAttempts: 0,
  currentPosition: 0,
  totalDuration: 0,
  bookmarks: {},
  notes: "",
  difficultyRating: undefined,
  feedback: "",
  instructorFeedback: "",
  isMandatory: true,
  weight: 1.00,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export interface ICourseProgressState extends IBaseState {
  readonly courseProgress: ICourseProgress[];
  readonly progress: ICourseProgress;
}

export interface ICourseProgressResponse extends IResponseBase {
  data: ICourseProgress;
}

export interface ICourseProgressResponses extends IResponseBase {
  data: ICourseProgress[];
}
