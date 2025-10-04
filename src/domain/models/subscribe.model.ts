export interface ISubscribe {
  id: number;
  email: string;
  name?: string;
  isActive: boolean;
  subscribedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const emptySubscribe: ISubscribe = {
  id: 0,
  email: "",
  name: "",
  isActive: true,
  subscribedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
};

