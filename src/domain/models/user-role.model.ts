import { IResponseBase } from "./response-base.model";

export interface IUserRole {
  userId: string;
  roleId: string;
}

export const emptyUserRole: IUserRole = {
  userId: "",
  roleId: "",
};

export interface IUserRoleResponse extends IResponseBase {
  data: IUserRole | null | IUserRole[];
}

