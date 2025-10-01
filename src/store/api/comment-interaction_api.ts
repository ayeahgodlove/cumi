import { baseAPI } from "./base-api";
import { ICommentInteractionStats } from "@domain/models/comment-interaction.model";

export const commentInteractionAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getCommentStats: build.query<ICommentInteractionStats, { commentId: string; userId?: string }>({
      query: ({ commentId, userId }) => `/comments/interactions/stats?commentId=${commentId}&userId=${userId || ''}`,
      providesTags: (result, error, { commentId }) => [
        { type: "CommentInteraction", id: commentId },
        { type: "CommentInteraction", id: "LIST" },
      ],
      keepUnusedDataFor: 90, // Cache for 90 seconds
    }),
    handleCommentInteraction: build.mutation<ICommentInteractionStats, { commentId: string; action: 'like' | 'dislike' }>({
      query: ({ commentId, action }) => ({
        url: "/comments/interactions",
        method: "POST",
        body: { commentId, action },
      }),
      invalidatesTags: (result, error, { commentId }) => [
        { type: "CommentInteraction", id: commentId },
        { type: "CommentInteraction", id: "LIST" },
      ],
    }),
    getUserCommentInteractions: build.query<any[], string>({
      query: (userId) => `/comments/interactions/user/${userId}`,
      providesTags: (result, error, userId) => [
        { type: "CommentInteraction", id: userId },
        { type: "CommentInteraction", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCommentStatsQuery,
  useHandleCommentInteractionMutation,
  useGetUserCommentInteractionsQuery,
} = commentInteractionAPI;
