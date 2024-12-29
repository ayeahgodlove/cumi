// src/presentation/dtos/course-request.dto.ts

import { emptyCourse, ICourse } from "@domain/models/course";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { nanoid } from "nanoid";
import slugify from "slugify";

export class CourseRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  authorName: string;

  @IsNotEmpty()
  @IsString()
  categoryId;

  @IsNotEmpty()
  @IsString()
  imageUrl;

  constructor(data: ICourse) {
    this.title = data.title;
    this.description = data.description;
    this.authorName = data.authorName;
    this.categoryId = data.categoryId;
    this.imageUrl = data.imageUrl
  }

  toData(): ICourse {
    return {
      ...emptyCourse,
      id: nanoid(10),
      title: this.title,
      description: this.description,
      authorName: this.authorName,
      categoryId: this.categoryId,
      slug: slugify(this.title, { lower: true, replacement: "-" }),
      imageUrl: this.imageUrl
    };
  }

  toUpdateData(data: ICourse): ICourse {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      authorName: data.authorName,
      imageUrl: data.imageUrl,
      categoryId: data.categoryId,
      slug: data.slug,
      userId: data.userId,
    };
  }
}
