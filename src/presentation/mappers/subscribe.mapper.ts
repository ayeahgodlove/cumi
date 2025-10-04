import { ISubscribe } from "@domain/models/subscribe.model";

export interface SubscribeDTO {
  id: number;
  email: string;
  name?: string;
  isActive: boolean;
  subscribedAt: string;
  createdAt: string;
  updatedAt: string;
}

export class SubscribeMapper {
  toDTO(subscribe: ISubscribe): SubscribeDTO {
    return {
      id: subscribe.id,
      email: subscribe.email,
      name: subscribe.name,
      isActive: subscribe.isActive,
      subscribedAt: subscribe.subscribedAt.toISOString(),
      createdAt: subscribe.createdAt.toISOString(),
      updatedAt: subscribe.updatedAt.toISOString()
    };
  }

  toDTOs(subscribes: ISubscribe[]): SubscribeDTO[] {
    return subscribes.map(subscribe => this.toDTO(subscribe));
  }

  toModel(dto: SubscribeDTO): ISubscribe {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.name,
      isActive: dto.isActive,
      subscribedAt: new Date(dto.subscribedAt),
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt)
    };
  }
}

export const subscribeMapper = new SubscribeMapper();

