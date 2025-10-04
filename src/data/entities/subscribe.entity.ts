import { ISubscriber } from "@domain/models/subscriber.model";

export class SubscribeEntity {
  constructor(
    public id: number,
    public email: string,
    public name?: string,
    public isActive: boolean = true,
    public subscribedAt: Date = new Date(),
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  static fromModel(model: ISubscriber): SubscribeEntity {
    return new SubscribeEntity(
      model.id,
      model.email,
      model.name,
      model.isActive,
      model.subscribedAt,
      model.createdAt,
      model.updatedAt
    );
  }

  toModel(): ISubscriber {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      isActive: this.isActive,
      subscribedAt: this.subscribedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

