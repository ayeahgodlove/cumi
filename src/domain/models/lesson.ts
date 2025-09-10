import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface ILesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  userId: string;
  courseId: string;
  authorName: string;
  duration: number;
  difficulty: string;
  url: string;
  prerequisites: string[];
  objectives: string[];
  keywords: string[];
  author: string;
  reviews?: string[];
  language?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
  // New fields from database schema
  durationMinutes?: number;
  lessonOrder: number;
  status: 'draft' | 'published' | 'archived';
  lessonType: 'video' | 'text' | 'audio' | 'practical' | 'discussion' | 'assignment';
  videoUrl?: string;
  audioUrl?: string;
  downloadMaterials?: string;
  isFreePreview: boolean;
  requiresCompletion: boolean;
  estimatedCompletionTime?: number;
  practicalExamples?: string;
  resourcesNeeded?: string;
}

export const emptyLesson: ILesson = {
  id: "",
  title: "",
  slug: "",
  description: "",
  content: "",
  imageUrl: "",
  userId: "",
  courseId: "",
  authorName: "",
  duration: 0,
  difficulty: "",
  url: "",
  prerequisites: [],
  objectives: [],
  keywords: [],
  author: "",
  reviews: [],
  language: "",
  rating: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  durationMinutes: 0,
  lessonOrder: 1,
  status: 'draft',
  lessonType: 'text',
  videoUrl: "",
  audioUrl: "",
  downloadMaterials: "",
  isFreePreview: false,
  requiresCompletion: true,
  estimatedCompletionTime: 0,
  practicalExamples: "",
  resourcesNeeded: "",
};

export interface ILessonState extends IBaseState {
  readonly lessons: ILesson[];
  readonly lesson: ILesson;
}

export interface ILessonResponse extends IResponseBase {
  data: ILesson;
}

export interface ILessonResponses extends IResponseBase {
  data: ILesson[];
}