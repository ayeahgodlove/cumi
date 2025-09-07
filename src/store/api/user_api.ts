import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";
import { IUser } from "@domain/models/user";

export const userAPI = createApi({
  reducerPath: "userAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  tagTypes: ["User"],
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
});
