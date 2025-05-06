import { IBanner } from "./banner.model";
import { IBaseState } from "./base-state.model";
import { IEvent } from "./event.model";
import { IPost } from "./post.model";
import { IProject } from "./project.model";
import { IResponseBase } from "./response-base.model";
import { IRole } from "./role.model";
import { IService } from "./service.model";

export interface IUser {
  id: string;
  email: string;
  username: string;
  fullname: string;
  password: string;
  authStrategy: string;
  address: string;
  verified: Boolean;

  banners?: IBanner[];
  posts?: IPost[];
  projects?: IProject[];
  services?: IService[];
  events?: IEvent[];
  roles?: IRole[];
  token?: string;
}

export const emptyUser: IUser = {
  id: "",
  username: "",
  fullname: "",
  email: "",
  password: "",
  address: "",
  authStrategy: "",
  verified: false,
};

export interface IUserState extends IBaseState {
  readonly users: IUser[];
  readonly user: IUser;
}
export interface IUserResponse extends IResponseBase {
  data: IUser | null | IUser[];
  message: string;
}
