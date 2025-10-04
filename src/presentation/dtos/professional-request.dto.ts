import { IProfessional } from "@domain/models/professional.model";
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from "class-validator";
import { nanoid } from "nanoid";

export class ProfessionalRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  position: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  yearsOfExperience: number;

  @IsNotEmpty()
  @IsString()
  bio: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  whatsappContact: string;

  @IsOptional()
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    portfolio?: string;
    website?: string;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  projectTypes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  portfolioImages?: string[];

  @IsOptional()
  testimonials?: {
    clientName: string;
    project: string;
    rating: number;
    comment: string;
  }[];

  constructor(data: IProfessional) {
    this.title = data.title;
    this.position = data.position;
    this.yearsOfExperience = data.yearsOfExperience;
    this.bio = data.bio;
    this.email = data.email;
    this.whatsappContact = data.whatsappContact;
    this.socialLinks = data.socialLinks;
    this.skills = data.skills;
    this.specializations = data.specializations;
    this.location = data.location;
    this.availability = data.availability;
    this.hourlyRate = data.hourlyRate;
    this.projectTypes = data.projectTypes;
    this.languages = data.languages;
    this.certifications = data.certifications;
    this.education = data.education;
    this.isVerified = data.isVerified;
    this.isActive = data.isActive;
    this.profileImage = data.profileImage;
    this.portfolioImages = data.portfolioImages;
    this.testimonials = data.testimonials;
  }

  toData(): IProfessional {
    return {
      id: nanoid(10),
      title: this.title,
      position: this.position,
      yearsOfExperience: this.yearsOfExperience,
      bio: this.bio,
      email: this.email,
      whatsappContact: this.whatsappContact,
      socialLinks: this.socialLinks || {},
      skills: this.skills || [],
      specializations: this.specializations || [],
      location: this.location,
      availability: this.availability || "Available",
      hourlyRate: this.hourlyRate,
      projectTypes: this.projectTypes || [],
      languages: this.languages || [],
      certifications: this.certifications || [],
      education: this.education || "",
      isVerified: this.isVerified || false,
      isActive: this.isActive !== undefined ? this.isActive : true,
      profileImage: this.profileImage,
      portfolioImages: this.portfolioImages || [],
      testimonials: this.testimonials || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  toUpdateData(data: IProfessional): IProfessional {
    return {
      ...data,
      title: this.title,
      position: this.position,
      yearsOfExperience: this.yearsOfExperience,
      bio: this.bio,
      email: this.email,
      whatsappContact: this.whatsappContact,
      socialLinks: this.socialLinks || data.socialLinks,
      skills: this.skills || data.skills,
      specializations: this.specializations || data.specializations,
      location: this.location,
      availability: this.availability || data.availability,
      hourlyRate: this.hourlyRate !== undefined ? this.hourlyRate : data.hourlyRate,
      projectTypes: this.projectTypes || data.projectTypes,
      languages: this.languages || data.languages,
      certifications: this.certifications || data.certifications,
      education: this.education || data.education,
      isVerified: this.isVerified !== undefined ? this.isVerified : data.isVerified,
      isActive: this.isActive !== undefined ? this.isActive : data.isActive,
      profileImage: this.profileImage || data.profileImage,
      portfolioImages: this.portfolioImages || data.portfolioImages,
      testimonials: this.testimonials || data.testimonials,
      updatedAt: new Date(),
    };
  }
}

