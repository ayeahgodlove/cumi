import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface ICourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string; 
  userId: string;
  categoryId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  // New fields from database schema
  price: number;
  isFree: boolean;
  currency: string;
  status: 'draft' | 'published' | 'archived' | 'suspended';
  level: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks?: number;
  maxStudents?: number;
  currentStudents: number;
  language: 'french' | 'english' | 'both' | 'fulfulde' | 'ewondo';
  targetAudience?: 'students' | 'professionals' | 'entrepreneurs' | 'farmers' | 'teachers' | 'youth' | 'women';
  certificateAvailable: boolean;
  prerequisites?: string;
  learningOutcomes?: string;
  instructorContact?: string;
}

export const emptyCourse: ICourse = {
  id: "",
  title: "",
  description: "",
  slug: "",
  imageUrl: "",
  userId: "",
  authorName: "",
  categoryId: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  price: 0,
  isFree: true,
  currency: 'XAF',
  status: 'draft',
  level: 'beginner',
  durationWeeks: undefined,
  maxStudents: undefined,
  currentStudents: 0,
  language: 'both',
  targetAudience: undefined,
  certificateAvailable: false,
  prerequisites: undefined,
  learningOutcomes: undefined,
  instructorContact: undefined,
};

export interface ICourseState extends IBaseState {
  readonly courses: ICourse[];
  readonly course: ICourse;
}

export interface ICourseResponse extends IResponseBase {
  data: ICourse;
}

export interface ICourseResponses extends IResponseBase {
  data: ICourse[];
}
