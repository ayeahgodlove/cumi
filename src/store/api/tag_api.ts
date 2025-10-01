import { baseAPI } from "./base-api";
import { ITag } from "@domain/models/tag";

export const tagAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSingleTag: build.query<ITag, string>({
      query: (tagId) => `/tags/${tagId}`,
      keepUnusedDataFor: 300, // Cache for 5 minutes (tags rarely change)
    }),
    fetchAllTags: build.query<ITag[], number | void>({
      query: (page = 1) => `/tags?page=${page}`,
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),
  }),
  overrideExisting: true,
});
