import { baseAPI } from "./base-api";

export interface IReviewResponse {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string;
  wouldRecommend: boolean;
  difficulty?: 'very_easy' | 'easy' | 'medium' | 'hard' | 'very_hard';
  isAnonymous: boolean;
  status: 'pending' | 'approved' | 'rejected';
  helpfulVotes: number;
  language: 'french' | 'english' | 'both';
  createdAt: string;
  updatedAt: string;
  // Populated fields
  user?: {
    id: string;
    fullname: string;
    username: string;
    email?: string;
  };
  course?: {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string;
  };
}

export interface IReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}

export interface ICourseReviewsResponse {
  reviews: IReviewResponse[];
  userReview?: IReviewResponse | null;
  stats?: IReviewStats;
}

export interface IReviewRequest {
  courseId: string;
  rating: number;
  comment: string;
  wouldRecommend: boolean;
  difficulty?: 'very_easy' | 'easy' | 'medium' | 'hard' | 'very_hard';
  isAnonymous?: boolean;
  language?: 'french' | 'english' | 'both';
}

export const reviewAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    // Create a new review
    createReview: build.mutation<IReviewResponse, IReviewRequest>({
      query: (review) => ({
        url: "/reviews",
        method: "POST",
        body: review,
      }),
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || null;
      },
      invalidatesTags: (result, error, { courseId }) => [
        { type: "CourseReviews", id: courseId },
        { type: "UserReviews", id: "LIST" },
        { type: "Review", id: "LIST" },
      ],
    }),

    // Update an existing review
    updateReview: build.mutation<IReviewResponse, Partial<IReviewRequest> & { id: string }>({
      query: (review) => ({
        url: "/reviews",
        method: "PUT",
        body: review,
      }),
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || null;
      },
      invalidatesTags: (result, error, { courseId, id }) => [
        { type: "CourseReviews", id: courseId },
        { type: "UserReviews", id: "LIST" },
        { type: "Review", id },
      ],
    }),

    // Delete a review
    deleteReview: build.mutation<void, { id: string; courseId: string }>({
      query: ({ id }) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { courseId, id }) => [
        { type: "CourseReviews", id: courseId },
        { type: "UserReviews", id: "LIST" },
        { type: "Review", id },
      ],
    }),

    // Get reviews for a specific course
    getCourseReviews: build.query<ICourseReviewsResponse, { courseId: string; userId?: string; includeStats?: boolean }>({
      query: ({ courseId, userId, includeStats = true }) => {
        const params = new URLSearchParams();
        if (userId) params.append("userId", userId);
        if (includeStats) params.append("includeStats", "true");
        
        return `/courses/${courseId}/reviews?${params.toString()}`;
      },
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return { reviews: [], userReview: null, stats: { totalReviews: 0, averageRating: 0, ratingDistribution: {} } };
      },
      providesTags: (result, error, { courseId }) => [
        { type: "CourseReviews", id: courseId },
        ...(result?.reviews || []).map(({ id }) => ({ type: "Review" as const, id })),
      ],
      keepUnusedDataFor: 180, // Cache reviews for 3 minutes
    }),

    // Get user's reviews
    getUserReviews: build.query<IReviewResponse[], string>({
      query: (userId) => `/reviews?userId=${userId}`,
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || [];
      },
      providesTags: (result) => [
        { type: "UserReviews", id: "LIST" },
        ...(result || []).map(({ id }) => ({ type: "Review" as const, id })),
      ],
    }),

    // Get a specific review
    getReview: build.query<IReviewResponse, string>({
      query: (id) => `/reviews/${id}`,
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || null;
      },
      providesTags: (result, error, id) => [{ type: "Review", id }],
    }),

    // Mark review as helpful
    markReviewHelpful: build.mutation<IReviewResponse, string>({
      query: (id) => ({
        url: `/reviews/${id}/actions`,
        method: "POST",
        body: { action: "helpful" },
      }),
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || null;
      },
      invalidatesTags: (result, error, id) => [
        { type: "Review", id },
        { type: "CourseReviews", id: "LIST" },
      ],
    }),

    // Admin: Approve review
    approveReview: build.mutation<IReviewResponse, { id: string; moderatorNotes?: string }>({
      query: ({ id, moderatorNotes }) => ({
        url: `/reviews/${id}/actions`,
        method: "POST",
        body: { action: "approve", moderatorNotes },
      }),
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || null;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Review", id },
        { type: "CourseReviews", id: "LIST" },
        { type: "Review", id: "LIST" },
      ],
    }),

    // Admin: Reject review
    rejectReview: build.mutation<IReviewResponse, { id: string; moderatorNotes?: string }>({
      query: ({ id, moderatorNotes }) => ({
        url: `/reviews/${id}/actions`,
        method: "POST",
        body: { action: "reject", moderatorNotes },
      }),
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || null;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Review", id },
        { type: "CourseReviews", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetCourseReviewsQuery,
  useGetUserReviewsQuery,
  useGetReviewQuery,
  useMarkReviewHelpfulMutation,
  useApproveReviewMutation,
  useRejectReviewMutation,
} = reviewAPI;
