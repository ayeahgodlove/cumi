import { IPartner } from "@domain/models/partner.model";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";
import { nanoid } from "nanoid";

export class PartnerRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  logo: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  contactPhone: string;

  @IsNotEmpty()
  @IsUrl()
  websiteLink: string;

  constructor(data: IPartner) {
    this.name = data.name;
    this.description = data.description;
    this.logo = data.logo;
    this.location = data.location;
    this.contactPhone = data.contactPhone;
    this.websiteLink = data.websiteLink;
  }

  toData(): IPartner {
    return {
      id: nanoid(10),
      name: this.name,
      description: this.description,
      logo: this.logo,
      location: this.location,
      contactPhone: this.contactPhone,
      websiteLink: this.websiteLink,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  toUpdateData(data: IPartner): IPartner {
    return {
      ...data,
      name: this.name,
      description: this.description,
      logo: this.logo,
      location: this.location,
      contactPhone: this.contactPhone,
      websiteLink: this.websiteLink,
      updatedAt: new Date(),
    };
  }
}

