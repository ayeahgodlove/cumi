import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";
import { ICategory } from "@domain/models/category";

export const categoryAPI = createApi({
  reducerPath: "categoryAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  tagTypes: ["Category"],
  endpoints: (build) => ({
    getSingleCategory: build.query<ICategory, string>({
      query: (categoryId) => `/categories/${categoryId}`,
    }),
    fetchAllCategories: build.query<ICategory[], number | void>({
      query: (page = 1) => `/categories?page=${page}`,
    }),
  }),
});
