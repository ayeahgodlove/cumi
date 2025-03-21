import { BASE_URL } from "@constants/api-url";
import { IUserResponse } from "@domain/models/user";
import axios from "axios";

const instance = axios.create({
  baseURL: BASE_URL // Replace with your API server URL
});

export const authService = {
  register: async (user: any): Promise<IUserResponse> =>
    await instance.post(`/users`, user),
  login: async (user: {
    email: string;
    password: string;
  }): Promise<any> => await instance.post("/auth", user),
  logout: async (): Promise<any> => await instance.get("/auth/logout"),
};
