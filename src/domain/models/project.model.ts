import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IProject {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  deployUrl: string;
  userId: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export const emptyProject: IProject = {
  id: "",
  title: "",
  description: "",
  imageUrl: "",
  githubUrl: "",
  deployUrl: "",
  userId: "",
  slug: "",
  createdAt: new Date(),
  updatedAt: new Date()
};

export interface IProjectState extends IBaseState {
  readonly projects: IProject[];
  readonly project: IProject;
}

export interface IProjectResponse extends IResponseBase {
  data: IProject | null | IProject[];
}


