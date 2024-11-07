import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";
import { IProject } from "@domain/models/project.model";

export const projectAPI = createApi({
  reducerPath: "projectAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  tagTypes: ["Project"],
  endpoints: (build) => ({
    getSingleProject: build.query<IProject, string>({
      query: (projectId) => `/projects/${projectId}`,
    }),
    fetchAllProjects: build.query<IProject[], number | void>({
      query: (page = 1) => `/projects?page=${page}`,
    }),
  }),
});
