import { baseAPI } from "./base-api";

export interface PublicStats {
  totalProjects: number;
  totalServices: number;
  totalPosts: number;
  totalEvents: number;
  totalCourses: number;
  totalUsers: number;
}

export const publicStatsAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getPublicStats: build.query<PublicStats, void>({
      query: () => `/public-stats`,
      providesTags: ["PublicStats"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetPublicStatsQuery } = publicStatsAPI;

