import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IComment {
  id: string;
  content: string;
  postId: string;
  userId: string;
  parentId?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  post?: {
    id: string;
    title: string;
    slug: string;
  };
  replies?: IComment[];
}

export const emptyComment: IComment = {
  id: "",
  content: "",
  postId: "",
  userId: "",
  parentId: "",
  isApproved: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export interface ICommentState extends IBaseState {
  readonly comments: IComment[];
}

export interface ICommentResponse extends IResponseBase {
  data: IComment[];
}