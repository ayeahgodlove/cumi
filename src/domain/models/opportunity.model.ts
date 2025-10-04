import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IOpportunity {
  id: string;
  title: string; 
  opp_type: 'job' | 'scholarship' | 'internship' | 'fellowship' | 'grant' | 'other';
  slug: string;
  description: string;
  requirements: string;
  deadline: Date;
  location: string;
  companyOrInstitution: string;
  contactEmail: string;
  applicationLink: string;
  isActive: boolean;
  
  // Additional fields for scholarships
  amount?: string; // Scholarship amount
  duration?: string; // Duration of scholarship/internship/job
  academicLevel?: string; // Undergraduate, Graduate, PhD, etc.
  fieldOfStudy?: string; // Field of study requirement
  nationality?: string; // Nationality requirements
  ageLimit?: number; // Age limit if applicable
  
  // Additional fields for jobs
  salaryRange?: string; // For job opportunities
  employmentType?: string; // Full-time, Part-time, Contract
  experienceLevel?: string; // Entry, Mid, Senior
  department?: string;
  isRemote?: boolean;
  skills?: string[]; // Required skills for jobs
  
  // Optional image (not displayed in current design)
  imageUrl?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export const emptyOpportunity: IOpportunity = {
  id: "",
  title: "",
  opp_type: "other",
  description: "",
  requirements: "",
  deadline: new Date(),
  location: "",
  companyOrInstitution: "",
  contactEmail: "",
  applicationLink: "",
  isActive: false,
  slug: "",
  amount: "",
  duration: "",
  academicLevel: "",
  fieldOfStudy: "",
  nationality: "",
  ageLimit: undefined,
  salaryRange: "",
  employmentType: "",
  experienceLevel: "",
  department: "",
  isRemote: false,
  skills: [],
  imageUrl: "",
  createdAt: new Date(),
  updatedAt: new Date()
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

