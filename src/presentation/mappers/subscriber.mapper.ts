import { ISubscriber } from "@domain/models/subscriber.model";
import { SubscriberResponseDto } from "@presentation/dtos/subscriber-request.dto";

export class SubscriberMapper {
  toDTO(subscriber: ISubscriber): SubscriberResponseDto {
    return {
      id: subscriber.id,
      email: subscriber.email,
      name: subscriber.name,
      isActive: subscriber.isActive,
      subscribedAt: subscriber.subscribedAt,
      createdAt: subscriber.createdAt,
      updatedAt: subscriber.updatedAt,
    };
  }

  toDTOs(subscribers: ISubscriber[]): SubscriberResponseDto[] {
    return subscribers.map((subscriber) => this.toDTO(subscriber));
  }

  toDomain(dto: SubscriberResponseDto): ISubscriber {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.name,
      isActive: dto.isActive,
      subscribedAt: dto.subscribedAt,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }
}

