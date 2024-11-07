import { API_URL } from "@constants/api-url";
import { IUser, IUserResponse } from "@domain/models/user";
import axios from "axios";

const instance = axios.create({
  baseURL: API_URL // Replace with your API server URL
});

export const authService = {
  register: async (user: IUser): Promise<IUserResponse> =>
    await instance.post(`/api/users`, user),
  login: async (user: {
    email: string;
    password: string;
  }): Promise<any> => await instance.post("/api/auth", user),
  logout: async (): Promise<any> => await instance.get("/api/auth/logout"),
};
