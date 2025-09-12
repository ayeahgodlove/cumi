import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IPostInteraction {
  id: string;
  postId: string;
  userId: string;
  action: 'like' | 'dislike';
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostInteractionStats {
  postId: string;
  likesCount: number;
  dislikesCount: number;
  userInteraction: 'like' | 'dislike' | null;
}

export const emptyPostInteraction: IPostInteraction = {
  id: "",
  postId: "",
  userId: "",
  action: "like",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export interface IPostInteractionState extends IBaseState {
  readonly interactions: IPostInteraction[];
}

export interface IPostInteractionResponse extends IResponseBase {
  data: IPostInteraction[];
}
