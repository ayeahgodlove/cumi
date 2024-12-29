import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface ICategory {
  id: string;
  name: string;
  slug: string;
}

export const emptyCategory: ICategory = {
  id: "",
  name: "",
  slug: "",
};

export interface ICategoryState extends IBaseState {
  readonly categories: ICategory[];
  readonly category: ICategory;
}
export interface ICategoryResponse extends IResponseBase {
  data: ICategory | null | ICategory[];
}
