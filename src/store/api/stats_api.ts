import { baseAPI } from "./base-api";

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
    totalComments: number;
    totalPostLikes: number;
    totalCommentLikes: number;
    totalUserLikes: number;
    totalUserComments: number;
    // Course-specific stats for creators
    totalCourseEnrollments: number;
    totalCourseModules: number;
    totalCourseAssignments: number;
    totalCourseProgress: number;
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

export const statsAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getDashboardStats: build.query<DashboardStats, void>({
      query: () => `/stats`,
      providesTags: ["Stats"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetDashboardStatsQuery } = statsAPI;

