// src/presentation/dtos/post-request.dto.ts

import { IsArray, IsNotEmpty, IsString, Length } from "class-validator";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { emptyPost, IPost } from "@domain/models/post.model";

export class PostRequestDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 128)
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 500)
  description: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsArray()
  tags: string[];

  constructor(data: IPost) {
    this.title = data.title;
    this.content = data.content;
    this.description = data.description;
    this.categoryId = data.categoryId;
    this.status = data.status;
    (this.imageUrl = data.imageUrl), (this.tags = data.tags);
  }

  toData(): IPost {
    return {
      ...emptyPost,
      id: nanoid(10),
      slug: slugify(this.title, { lower: true, replacement: "-" }),
      title: this.title,
      content: this.content,
      categoryId: this.categoryId,
      description: this.description,
      status: this.status,
      imageUrl: this.imageUrl,
      tags: this.tags,
      // authorId will be set by the API route
    };
  }

  toUpdateData(data: IPost): IPost {
    return {
      id: data.id,
      title: data.title,
      authorId: data.authorId,
      categoryId: data.categoryId,
      content: data.content,
      imageUrl: data.imageUrl,
      publishedAt: data.publishedAt,
      slug: data.slug,
      description: data.description,
      status: data.status,
      tags: data.tags,
    };
  }
}

