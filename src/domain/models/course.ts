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
}

export const emptyCourse: ICourse = {
  id: "",
  title: "",
  description: "",
  slug: "",
  imageUrl: "",
  userId: "",
  authorName: "",
  categoryId: ""
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
