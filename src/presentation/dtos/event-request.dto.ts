// src/presentation/dtos/event-request.dto.ts

import { emptyEvent, IEvent } from "@domain/models/event.model";
import {  IsNotEmpty, IsString, Length } from "class-validator";
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
  @Length(10, 128)
  location: string;
  

  constructor(data: IEvent) {
    this.title = data.title;
    this.description = data.description;
    this.location = data.location;
  }

  toData(): IEvent {
    return {
      ...emptyEvent,
      id: nanoid(10),
      title: this.title,
      description: this.description,
      location: this.location,
      slug:  slugify(this.title, {lower: true, replacement: "-"}),
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
      slug: data.slug
    }
  }
}
