import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";

export interface PublicStats {
  totalProjects: number;
  totalServices: number;
  totalPosts: number;
  totalEvents: number;
  totalCourses: number;
  totalUsers: number;
}

export const publicStatsAPI = createApi({
  reducerPath: "publicStatsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  tagTypes: ["PublicStats"],
  endpoints: (build) => ({
    getPublicStats: build.query<PublicStats, void>({
      query: () => `/public-stats`,
      providesTags: ["PublicStats"],
    }),
  }),
});

export const { useGetPublicStatsQuery } = publicStatsAPI;
