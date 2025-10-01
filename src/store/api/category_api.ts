import { baseAPI } from "./base-api";
import { ICategory } from "@domain/models/category";

export const categoryAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSingleCategory: build.query<ICategory, string>({
      query: (categoryId) => `/categories/${categoryId}`,
    }),
    fetchAllCategories: build.query<ICategory[], number | void>({
      query: (page = 1) => `/categories?page=${page}`,
    }),
  }),
  overrideExisting: false,
});
