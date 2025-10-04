// src/presentation/dtos/tag-request.dto.ts

import {  IsNotEmpty, IsString, Length } from "class-validator";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { emptyTag, ITag } from "@domain/models/tag";

export class TagRequestDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 25)
  name: string;

  constructor(data: ITag) {
    this.name = data.name;
  }

  toData(): ITag {
    return {
      ...emptyTag,
      id: nanoid(10),
      slug:  slugify(this.name, {lower: true, replacement: "-"}),
      name: this.name,
    };
  }

  toUpdateData(data: ITag): ITag {
    return {
      id: data.id,
      name: data.name,
      slug: slugify(data.name, {lower: true, replacement: "-"}),
    }
  }
}

