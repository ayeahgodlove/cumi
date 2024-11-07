import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";
import { ITag } from "@domain/models/tag";

export const tagAPI = createApi({
  reducerPath: "tagAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  tagTypes: ["Tag"],
  endpoints: (build) => ({
    getSingleTag: build.query<ITag, string>({
      query: (tagId) => `/tags/${tagId}`,
    }),
    fetchAllTags: build.query<ITag[], number | void>({
      query: (page = 1) => `/tags?page=${page}`,
    }),
  }),
});
