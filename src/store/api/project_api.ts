import { baseAPI } from "./base-api";
import { IProject } from "@domain/models/project.model";

export const projectAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSingleProject: build.query<IProject, string>({
      query: (projectId) => `/projects/${projectId}`,
    }),
    getSingleProjectBySlug: build.query<IProject, string>({
      query: (slug) => `/projects/slugs/${slug}`,
    }),
    fetchAllProjects: build.query<IProject[], number | void>({
      query: (page = 1) => `/projects?page=${page}`,
    }),
  }),
  overrideExisting: true,
});

