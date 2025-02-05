import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IOpportunity {
  id: string;
  title: string; 
  opp_type: string;
  slug: string;
  description: string;
  requirements: string;
  deadline: Date;
  location: string;
  companyOrInstitution: string;
  contactEmail: string;
  applicationLink: string;
  isActive: boolean;
}

export const emptyOpportunity: IOpportunity = {
  id: "",
  title: "",
  opp_type: "",
  description: "",
  requirements: "",
  deadline: new Date(),
  location: "",
  companyOrInstitution: "",
  contactEmail: "",
  applicationLink: "",
  isActive: false,
  slug: ""
};

export interface IOpportunityState extends IBaseState {
  readonly oppoIOpportunities: IOpportunity[];
  readonly oppoIOpportunity: IOpportunity;
}
export interface IOpportunityResponse extends IResponseBase {
  data: IOpportunity | null | IOpportunity[];
}

export interface IOpportunityResponses extends IResponseBase {
  data: IOpportunity[];
}
