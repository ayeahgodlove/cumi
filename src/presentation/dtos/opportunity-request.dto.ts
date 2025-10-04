// src/presentation/dtos/opportunity-request.dto.ts

import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Length,
} from "class-validator";
import slugify from "slugify";
import { nanoid } from "nanoid";
import {
  emptyOpportunity,
  IOpportunity,
} from "@domain/models/opportunity.model";

export class OpportunityRequestDto {
  // Core fields
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

  deadline: Date;

  @IsBoolean()
  isActive: boolean;

  // Scholarship-specific fields
  @IsOptional()
  @IsString()
  amount?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  academicLevel?: string;

  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsNumber()
  ageLimit?: number;

  // Job-specific fields
  @IsOptional()
  @IsString()
  salaryRange?: string;

  @IsOptional()
  @IsString()
  employmentType?: string;

  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsBoolean()
  isRemote?: boolean;

  @IsOptional()
  @IsArray()
  skills?: string[];

  // Optional image
  @IsOptional()
  @IsString()
  imageUrl?: string;

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
    this.isActive = data.isActive ?? true;
    
    // Optional fields
    this.amount = data.amount;
    this.duration = data.duration;
    this.academicLevel = data.academicLevel;
    this.fieldOfStudy = data.fieldOfStudy;
    this.nationality = data.nationality;
    this.ageLimit = data.ageLimit;
    this.salaryRange = data.salaryRange;
    this.employmentType = data.employmentType;
    this.experienceLevel = data.experienceLevel;
    this.department = data.department;
    this.isRemote = data.isRemote;
    this.skills = data.skills;
    this.imageUrl = data.imageUrl;
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
      // Scholarship fields
      amount: this.amount,
      duration: this.duration,
      academicLevel: this.academicLevel,
      fieldOfStudy: this.fieldOfStudy,
      nationality: this.nationality,
      ageLimit: this.ageLimit,
      // Job fields
      salaryRange: this.salaryRange,
      employmentType: this.employmentType,
      experienceLevel: this.experienceLevel,
      department: this.department,
      isRemote: this.isRemote,
      skills: this.skills,
      // Optional
      imageUrl: this.imageUrl,
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
      // Scholarship fields
      amount: data.amount,
      duration: data.duration,
      academicLevel: data.academicLevel,
      fieldOfStudy: data.fieldOfStudy,
      nationality: data.nationality,
      ageLimit: data.ageLimit,
      // Job fields
      salaryRange: data.salaryRange,
      employmentType: data.employmentType,
      experienceLevel: data.experienceLevel,
      department: data.department,
      isRemote: data.isRemote,
      skills: data.skills,
      // Optional
      imageUrl: data.imageUrl,
      // Timestamps
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}

