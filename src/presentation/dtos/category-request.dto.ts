// src/presentation/dtos/category-request.dto.ts

import {  IsNotEmpty, IsString, Length } from "class-validator";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { emptyCategory, ICategory } from "@domain/models/category";
export class CategoryRequestDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 25)
  name: string;

  constructor(data: ICategory) {
    this.name = data.name;
  }

  toData(): ICategory {
    return {
      ...emptyCategory,
      id: nanoid(10),
      slug:  slugify(this.name, {lower: true, replacement: "-"}),
      name: this.name,
    };
  }

  toUpdateData(data: ICategory): ICategory {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
    }
  }
}

