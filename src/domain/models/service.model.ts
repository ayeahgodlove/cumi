import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IService {
  id: string;
  title: string;
  description: string;
  userId: string;
  slug: string;
  imageUrl: string
}

export const emptyService: IService = {
  id: "",
  title: "",
  description: "",
  userId: "",
  slug: "",
  imageUrl: ""
};

export interface IServiceState extends IBaseState {
  readonly services: IService[];
  readonly service: IService;
}

export interface IServiceResponse extends IResponseBase {
  data: IService | null | IService[];
}
