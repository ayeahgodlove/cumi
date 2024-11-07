// src/presentation/dtos/role-request.dto.ts

import { emptyRole, IRole } from "@domain/models/role.model";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { nanoid } from "nanoid";
import slugify from "slugify";

export class RoleRequestDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 10)
  name: string;

  constructor(data: IRole) {
    this.name = data.name;
  }

  toData(): IRole {
    return {
      ...emptyRole,
      id: nanoid(10),
      name: this.name,
      slug:  slugify(this.name, {lower: true, replacement: "-"}),
    };
  }

  toUpdateData(data: IRole): IRole {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug
    };
  }
}
