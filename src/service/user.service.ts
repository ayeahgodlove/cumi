import { requestType } from ".";
import { IUser, IUserResponse } from "@domain/models/user";

export const userService = {
  list: (): Promise<IUserResponse> => requestType.get("/users"),
  details: (code: string): Promise<IUserResponse> =>
    requestType.get(`/users/${code}`),
  create: (user: IUser): Promise<IUserResponse> =>
  requestType.post(`/users`, user),
  update: (user: IUser): Promise<IUserResponse> =>
    requestType.put(`/users`, user),
  delete: (user: IUser): Promise<IUserResponse> =>
    requestType.del(`/users`, user),
};
