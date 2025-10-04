import { baseAPI } from "./base-api";
import { ICategory } from "@domain/models/category";

export const categoryAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSingleCategory: build.query<ICategory, string>({
      query: (categoryId) => `/categories/${categoryId}`,
      keepUnusedDataFor: 300, // Cache for 5 minutes (categories rarely change)
    }),
    fetchAllCategories: build.query<ICategory[], number | void>({
      query: (page = 1) => `/categories?page=${page}`,
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),
  }),
  overrideExisting: true,
});

