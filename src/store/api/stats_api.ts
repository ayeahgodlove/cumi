import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";

export interface DashboardStats {
  overview: {
    totalUsers: number;
    totalPosts: number;
    totalEvents: number;
    totalCourses: number;
    totalProjects: number;
    totalOpportunities: number;
    totalServices: number;
    totalProfessionals: number;
    totalBanners: number;
    totalMedia: number;
    totalMessages: number;
    totalSubscribers: number;
  };
  recentActivity: {
    newUsers: number;
    newPosts: number;
    newEvents: number;
  };
  recentActivities: {
    key: string;
    user: string;
    action: string;
    item: string;
    time: string;
    status: string;
    type: string;
  }[];
  growth: {
    userGrowth: number;
    postGrowth: number;
    eventGrowth: number;
  };
  breakdown: {
    opportunitiesByType: Record<string, number>;
    postsByCategory: Record<string, number>;
  };
  lastUpdated: string;
}

export const statsAPI = createApi({
  reducerPath: "statsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  tagTypes: ["Stats"],
  endpoints: (build) => ({
    getDashboardStats: build.query<DashboardStats, void>({
      query: () => `/stats`,
      providesTags: ["Stats"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = statsAPI;
