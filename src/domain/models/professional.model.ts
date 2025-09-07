import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IProfessional {
  id: string;
  title: string;
  position: string;
  yearsOfExperience: number;
  bio: string;
  email: string;
  whatsappContact: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    portfolio?: string;
    website?: string;
  };
  skills: string[];
  specializations: string[];
  location: string;
  availability: string; // Available, Busy, Not Available
  hourlyRate?: number;
  projectTypes: string[]; // Web Development, Mobile Apps, etc.
  languages: string[];
  certifications: string[];
  education: string;
  isVerified: boolean;
  isActive: boolean;
  profileImage?: string;
  portfolioImages: string[];
  testimonials: {
    clientName: string;
    project: string;
    rating: number;
    comment: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export const emptyProfessional: IProfessional = {
  id: "",
  title: "",
  position: "",
  yearsOfExperience: 0,
  bio: "",
  email: "",
  whatsappContact: "",
  socialLinks: {},
  skills: [],
  specializations: [],
  location: "",
  availability: "Available",
  hourlyRate: 0,
  projectTypes: [],
  languages: [],
  certifications: [],
  education: "",
  isVerified: false,
  isActive: true,
  profileImage: "",
  portfolioImages: [],
  testimonials: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export interface IProfessionalState extends IBaseState {
  readonly professionals: IProfessional[];
  readonly professional: IProfessional;
}

export interface IProfessionalResponse extends IResponseBase {
  data: IProfessional | null | IProfessional[];
}

export interface IProfessionalResponses extends IResponseBase {
  data: IProfessional[];
}
