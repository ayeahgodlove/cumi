import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface ITag {
  id: string;
  name: string;
  slug: string;
}

export const emptyTag: ITag = {
  id: "",
  name: "",
  slug: ""
};

export interface ITagState extends IBaseState {
  readonly tags: ITag[]
  readonly tag: ITag
} 

export interface ITagResponse extends IResponseBase {
  data: ITag | null | ITag[];
}
