// src/presentation/dtos/event-request.dto.ts

import { emptyEvent, IEvent } from "@domain/models/event.model";
import { IsArray, IsNotEmpty, IsString, Length, IsOptional, IsNumber, IsBoolean, IsEnum, IsDateString } from "class-validator";
import { nanoid } from "nanoid";
import slugify from "slugify";
export class EventRequestDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 255)
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsArray()
  tags: string[];

  // New fields from database schema
  @IsOptional()
  @IsEnum(['draft', 'published', 'cancelled', 'completed'])
  status?: 'draft' | 'published' | 'cancelled' | 'completed';

  @IsOptional()
  @IsDateString()
  eventEndDate?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @IsOptional()
  @IsNumber()
  entryFee?: number;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsOptional()
  @IsNumber()
  maxAttendees?: number;

  @IsOptional()
  @IsEnum(['workshop', 'seminar', 'conference', 'training', 'meeting', 'social', 'religious', 'cultural', 'sports', 'business'])
  category?: 'workshop' | 'seminar' | 'conference' | 'training' | 'meeting' | 'social' | 'religious' | 'cultural' | 'sports' | 'business';

  @IsOptional()
  @IsEnum(['students', 'professionals', 'general_public', 'youth', 'women', 'entrepreneurs', 'farmers', 'teachers'])
  targetAudience?: 'students' | 'professionals' | 'general_public' | 'youth' | 'women' | 'entrepreneurs' | 'farmers' | 'teachers';

  @IsOptional()
  @IsEnum(['french', 'english', 'both'])
  language?: 'french' | 'english' | 'both';

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsBoolean()
  registrationRequired?: boolean;

  @IsOptional()
  @IsDateString()
  registrationDeadline?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  constructor(data: IEvent) {
    this.title = data.title;
    this.description = data.description;
    this.location = data.location;
    this.tags = data.tags;
    this.imageUrl = data.imageUrl;
    this.status = data.status;
    this.eventEndDate = data.eventEndDate?.toISOString();
    this.contactPhone = data.contactPhone;
    this.contactEmail = data.contactEmail;
    this.whatsappNumber = data.whatsappNumber;
    this.entryFee = data.entryFee;
    this.isFree = data.isFree;
    this.maxAttendees = data.maxAttendees;
    this.category = data.category;
    this.targetAudience = data.targetAudience;
    this.language = data.language;
    this.region = data.region;
    this.city = data.city;
    this.registrationRequired = data.registrationRequired;
    this.registrationDeadline = data.registrationDeadline?.toISOString();
    this.requirements = data.requirements;
  }

  toData(): IEvent {
    return {
      ...emptyEvent,
      id: nanoid(10),
      title: this.title,
      description: this.description,
      location: this.location,
      slug: slugify(this.title, { lower: true, replacement: "-" }),
      tags: this.tags,
      imageUrl: this.imageUrl,
      status: this.status ?? 'draft',
      eventEndDate: this.eventEndDate ? new Date(this.eventEndDate) : undefined,
      contactPhone: this.contactPhone,
      contactEmail: this.contactEmail,
      whatsappNumber: this.whatsappNumber,
      entryFee: this.entryFee ?? 0,
      isFree: this.isFree ?? true,
      maxAttendees: this.maxAttendees,
      currentAttendees: 0,
      category: this.category,
      targetAudience: this.targetAudience,
      language: this.language ?? 'both',
      region: this.region,
      city: this.city,
      registrationRequired: this.registrationRequired ?? false,
      registrationDeadline: this.registrationDeadline ? new Date(this.registrationDeadline) : undefined,
      requirements: this.requirements,
      // userId will be set by the API route
    };
  }

  toUpdateData(data: IEvent): IEvent {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      location: data.location,
      userId: data.userId,
      eventDate: data.eventDate,
      slug: data.slug,
      tags: data.tags,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      status: data.status,
      eventEndDate: data.eventEndDate,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      whatsappNumber: data.whatsappNumber,
      entryFee: data.entryFee,
      isFree: data.isFree,
      maxAttendees: data.maxAttendees,
      currentAttendees: data.currentAttendees,
      category: data.category,
      targetAudience: data.targetAudience,
      language: data.language,
      region: data.region,
      city: data.city,
      registrationRequired: data.registrationRequired,
      registrationDeadline: data.registrationDeadline,
      requirements: data.requirements,
    };
  }
}
