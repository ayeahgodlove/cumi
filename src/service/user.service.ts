import { requestType } from ".";
import { IUser, IUserResponse } from "@domain/models/user";

export const userService = {
  list: (): Promise<IUserResponse> => requestType.get("/api/users"),
  details: (code: string): Promise<IUserResponse> =>
    requestType.get(`/api/users/${code}`),
  create: (user: IUser): Promise<IUserResponse> =>
  requestType.post(`/api/users`, user),
  update: (user: IUser): Promise<IUserResponse> =>
    requestType.put(`/api/users`, user),
  delete: (user: IUser): Promise<IUserResponse> =>
    requestType.del(`/api/users`, user),
};
