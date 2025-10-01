import { baseAPI } from "./base-api";
import { IUser } from "@domain/models/user";

export const userAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSingleUser: build.query<IUser, string>({
      query: (userId) => `/users/${userId}`,
    }),
    getUserByUsername: build.query<IUser, string>({
      query: (username) => `/users/username/${username}`,
    }),
    fetchAllUsers: build.query<IUser[], number | void>({
      query: (page = 1) => `/users?page=${page}`,
    }),
  }),
  overrideExisting: false,
});
