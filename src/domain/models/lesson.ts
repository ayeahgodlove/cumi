import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface ILesson {
  id: string;
  title: string;
  description: string;
  userId: string;
  content: string;
  duration: number;
  difficulty: string;
  courseId: string;
  url: string;
  slug: string
  // dependencies
  imageUrl: string;
  prerequisites: string[];
  objectives: string[];
  keywords: string[];

   // Additional properties
   author: string;
   language?: string;
   targetAudience?: string;
   rating?: number;
   reviews?: string[];
}

export const emptyLesson: ILesson = {
  id: "",
  title: "",
  description: "",
  userId: "",
  content: "",
  duration: 0,
  difficulty: "",
  prerequisites: [],
  objectives: [],
  keywords: [],
  author: "",
  courseId: "",
  url: "",
  slug: "",
  imageUrl: ""
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