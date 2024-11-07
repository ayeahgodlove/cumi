// src/presentation/dtos/media-request.dto.ts

import { emptyMedia, IMedia } from "@domain/models/media.model";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { nanoid } from "nanoid";
import slugify from "slugify";
export class MediaRequestDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 255)
  title: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  constructor(title: string, imageUrl: string) {
    this.title = title;
    this.imageUrl = imageUrl;
  }

  toData(): IMedia {
    return {
      ...emptyMedia,
      id: nanoid(10),
      title: this.title,
      slug: slugify(this.title, { lower: true, replacement: "-" }),
      imageUrl: this.imageUrl,
    };
  }

  toUpdateData(data: IMedia): IMedia {
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      imageUrl: data.imageUrl,
    };
  }
}
