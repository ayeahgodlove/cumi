// src/presentation/dtos/banner-request.dto.ts

import { emptyBanner, IBanner } from "@domain/models/banner.model";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { nanoid } from "nanoid";
import slugify from "slugify";
export class BannerRequestDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 255)
  title: string;

  @IsNotEmpty()
  @IsString()
  subTitle: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  constructor(data: IBanner) {
    this.title = data.title;
    this.subTitle = data.subTitle;
    this.image = data.image;
  }

  toData(): IBanner {
    return {
      ...emptyBanner,
      id: nanoid(10),
      title: this.title,
      subTitle: this.subTitle,
      image: this.image,
      slug: slugify(this.title, { lower: true, replacement: "-" }),
      // userId will be set by the API route
    };
  }

  toUpdateData(data: IBanner): IBanner {
    return {
      id: data.id,
      title: data.title,
      subTitle: data.subTitle,
      image: data.image,
      userId: data.userId,
      slug: data.slug,
    };
  }
}
