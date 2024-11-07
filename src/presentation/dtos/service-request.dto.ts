// src/presentation/dtos/service-request.dto.ts

import { emptyService, IService } from "@domain/models/service.model";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { nanoid } from "nanoid";
import slugify from "slugify";
export class ServiceRequestDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 255)
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;


  constructor(data: IService) {
    this.title = data.title;
    this.description = data.description;
  }

  toData(): IService {
    return {
      ...emptyService,
      id: nanoid(10),
      title: this.title,
      description: this.description,
      slug:  slugify(this.title, {lower: true, replacement: "-"}),
    };
  }

  toUpdateData(data: IService): IService {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      userId: data.userId,
      slug: data.slug
    };
  }
}
