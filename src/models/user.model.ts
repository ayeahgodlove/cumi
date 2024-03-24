import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";
import { IRole } from "./role.model";

export interface IUser {
  id: string;
  firstname: string;
  authStrategy: string;
  lastname: string;
  username: string;
  email: string;
  avatar: string;
  phoneNumber: string;
  city: string; //town
  country: string;
  address: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean;
  userRole: string;
  roles: IRole[];
  token?: string;
}

export const emptyUser: IUser = {
  id: "",
  username: "",
  lastname: "",
  firstname: "",
  email: "",
  password: "",
  address: "",
  phoneNumber: "",
  authStrategy: "",
  avatar: "",
  city: "",
  country: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  verified: false,
  userRole: "",
  roles: []
};

export interface IUserState extends IBaseState {
  readonly users: IUser[];
  readonly user: IUser;
}

export interface IUserResponse extends IResponseBase {
  data: IUser;
  message: string;
}
export interface IUserResponses extends IResponseBase {
  data: IUser[];
}
