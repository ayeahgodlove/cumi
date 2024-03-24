import { IResponseBase } from "./response-base.model";

export interface IRole {
  id: string;
  name: string;
}

export const emptyRole: IRole = {
  id: "",
  name: "",
};

export interface IOrderResponse extends IResponseBase {
  data: IRole;
}
