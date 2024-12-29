import { IResponseBase } from "./response-base.model";

export interface IRole {
  id: string;
  name: string;
  slug: string;
}

export const emptyRole: IRole = {
  id: "",
  name: "",
  slug: "",
};

export interface IRoleResponse extends IResponseBase {
  data: IRole | null | IRole[];
}
