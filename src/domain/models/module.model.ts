import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IModule {
  id: string;
  title: string;
  slug: string;
  description?: string;
  courseId: string;
  userId: string;
  moduleOrder: number;
  status: 'draft' | 'published' | 'archived';
  learningObjectives?: string;
  prerequisites?: string;
  estimatedDurationHours?: number;
  isLocked: boolean;
  unlockDate?: Date;
  totalLessons: number;
  totalQuizzes: number;
  totalAssignments: number;
  createdAt: Date;
  updatedAt: Date;
}

export const emptyModule: IModule = {
  id: "",
  title: "",
  slug: "",
  description: "",
  courseId: "",
  userId: "",
  moduleOrder: 1,
  status: 'draft',
  learningObjectives: "",
  prerequisites: "",
  estimatedDurationHours: 0,
  isLocked: false,
  unlockDate: undefined,
  totalLessons: 0,
  totalQuizzes: 0,
  totalAssignments: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export interface IModuleState extends IBaseState {
  readonly modules: IModule[];
  readonly module: IModule;
}

export interface IModuleResponse extends IResponseBase {
  data: IModule;
}

export interface IModuleResponses extends IResponseBase {
  data: IModule[];
}

