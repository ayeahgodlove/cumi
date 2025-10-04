// src/presentation/dtos/project-request.dto.ts

import { emptyProject, IProject } from "@domain/models/project.model";
import {  IsNotEmpty, IsString, Length } from "class-validator";
import { nanoid } from "nanoid";
import slugify from "slugify";
export class ProjectRequestDto {
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
  githubUrl: string;
  
  @IsNotEmpty()
  @IsString()
  @Length(10, 128)
  deployUrl: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  constructor(data: IProject) {
    this.title = data.title;
    this.description = data.description;
    this.githubUrl = data.githubUrl;
    this.deployUrl = data.deployUrl;
    this.imageUrl = data.imageUrl
  }

  toData(): IProject {
    return {
      ...emptyProject,
      id: nanoid(10),
      title: this.title,
      deployUrl: this.deployUrl,
      description: this.description,
      githubUrl: this.githubUrl,
      slug:  slugify(this.title, {lower: true, replacement: "-"}),
      imageUrl: this.imageUrl,
      // userId will be set by the API route
    };
  }

  toUpdateData(data: IProject): IProject {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      githubUrl: data.githubUrl,
      deployUrl: data.deployUrl,
      userId: data.userId,
      slug: data.slug,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }
  }
}

