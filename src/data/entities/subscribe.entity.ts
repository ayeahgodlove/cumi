import { ISubscribe } from "./subscribe.model";

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

  static fromModel(model: ISubscribe): SubscribeEntity {
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

  toModel(): ISubscribe {
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
