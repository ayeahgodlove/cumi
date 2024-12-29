import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IMedia {
  id: string;
  title: string;
  imageUrl: string;
  slug: string;
  mediaFile?: any
}

export const emptyMedia: IMedia = {
  id: "",
  title: "",
  imageUrl: "",
  slug: ""
};

export interface IMediaState extends IBaseState {
  readonly medias: IMedia[];
  readonly media: IMedia;
}
export interface IMediaResponse extends IResponseBase {
  data: IMedia | null | IMedia[];
}

export interface IMediaResponses extends IResponseBase {
  data: IMedia[];
}

