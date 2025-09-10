import { IBaseState } from "./base-state.model";
import { IResponseBase } from "./response-base.model";

export interface IEvent {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  imageUrl: string;
  location: string;
  userId: string;
  slug: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
  // New fields from database schema
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  eventEndDate?: Date;
  contactPhone?: string;
  contactEmail?: string;
  whatsappNumber?: string;
  entryFee: number;
  isFree: boolean;
  maxAttendees?: number;
  currentAttendees: number;
  category?: 'workshop' | 'seminar' | 'conference' | 'training' | 'meeting' | 'social' | 'religious' | 'cultural' | 'sports' | 'business';
  targetAudience?: 'students' | 'professionals' | 'general_public' | 'youth' | 'women' | 'entrepreneurs' | 'farmers' | 'teachers';
  language: 'french' | 'english' | 'both';
  region?: string;
  city?: string;
  registrationRequired: boolean;
  registrationDeadline?: Date;
  requirements?: string;
}

export const emptyEvent: IEvent = {
  id: "",
  title: "",
  description: "",
  imageUrl: "",
  eventDate: new Date(),
  location: "",
  userId: "",
  slug: "",
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'draft',
  eventEndDate: undefined,
  contactPhone: "",
  contactEmail: "",
  whatsappNumber: "",
  entryFee: 0,
  isFree: true,
  maxAttendees: undefined,
  currentAttendees: 0,
  category: undefined,
  targetAudience: undefined,
  language: 'both',
  region: "",
  city: "",
  registrationRequired: false,
  registrationDeadline: undefined,
  requirements: "",
};

export interface IEventState extends IBaseState {
  readonly events: IEvent[];
  readonly event: IEvent;
}

export interface IEventResponse extends IResponseBase {
  data: IEvent | null | IEvent[];
}

