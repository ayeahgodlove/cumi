import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IPartner {
  id: string;
  name: string;
  description: string;
  logo: string;
  location: string;
  contactPhone: string;
  websiteLink: string;
  createdAt: Date;
  updatedAt: Date;
}

export const emptyPartner: IPartner = {
  id: "",
  name: "",
  description: "",
  logo: "",
  location: "",
  contactPhone: "",
  websiteLink: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export interface IPartnerState extends IBaseState {
  readonly partners: IPartner[];
  readonly partner: IPartner;
}

export interface IPartnerResponse extends IResponseBase {
  data: IPartner | null | IPartner[];
}

export interface IPartnerResponses extends IResponseBase {
  data: IPartner[];
}

