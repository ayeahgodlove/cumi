// src/presentation/dtos/opportunity-request.dto.ts

import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  Length,
} from "class-validator";
import slugify from "slugify";
import { nanoid } from "nanoid";
import {
  emptyOpportunity,
  IOpportunity,
} from "@domain/models/opportunity.model";
export class OpportunityRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  opp_type: 'job' | 'scholarship' | 'internship' | 'fellowship' | 'grant' | 'other';

  @IsNotEmpty()
  @IsString()
  requirements: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  companyOrInstitution: string;

  @IsNotEmpty()
  @IsString()
  contactEmail: string;

  @IsNotEmpty()
  @IsString()
  applicationLink: string;

  // @IsDate()
  deadline: Date;

  @IsBoolean()
  isActive: boolean;

  constructor(data: IOpportunity) {
    this.title = data.title;
    this.opp_type = data.opp_type;
    this.description = data.description;
    this.requirements = data.requirements;
    this.location = data.location;
    this.companyOrInstitution = data.companyOrInstitution;
    this.contactEmail = data.contactEmail;
    this.applicationLink = data.applicationLink;
    this.deadline = data.deadline;
    this.isActive = true;
  }

  toData(): IOpportunity {
    return {
      ...emptyOpportunity,
      id: nanoid(10),
      slug: slugify(this.title, { lower: true, replacement: "-" }),
      title: this.title,
      opp_type: this.opp_type,
      description: this.description,
      requirements: this.requirements,
      location: this.location,
      companyOrInstitution: this.companyOrInstitution,
      contactEmail: this.contactEmail,
      applicationLink: this.applicationLink,
      deadline: this.deadline,
      isActive: this.isActive,
    };
  }

  toUpdateData(data: IOpportunity): IOpportunity {
    return {
      id: data.id,
      title: data.title,
      opp_type: data.opp_type,
      location: data.location,
      description: data.description,
      requirements: data.requirements,
      deadline: data.deadline,
      slug: data.slug,
      companyOrInstitution: data.companyOrInstitution,
      contactEmail: data.contactEmail,
      applicationLink: data.applicationLink,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
