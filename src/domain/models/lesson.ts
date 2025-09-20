import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface ILesson {
  // Database insertion order: id, title, slug, description, content, imageUrl, userId, courseId, moduleId, authorName, difficulty, prerequisites, objectives, keywords, reviews, language, rating, created_at, updated_at, duration_minutes, lesson_order, status, lesson_type, video_url, audio_url, download_materials, is_free_preview, requires_completion, estimated_completion_time, practical_examples, resources_needed

  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  userId: string;
  courseId: string;
  moduleId: string;
  authorName: string;
  difficulty: string;
  // Stored as LONGTEXT JSON in DB; in app may be arrays or raw string
  prerequisites: string[] | string;
  objectives: string[] | string;
  keywords: string[] | string;
  reviews?: string[] | string;
  language?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
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
  moduleId: "",
  authorName: "",
  difficulty: "",
  prerequisites: [],
  objectives: [],
  keywords: [],
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
  practicalExamples: [],
  resourcesNeeded: [],
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