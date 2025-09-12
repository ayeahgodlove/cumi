import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";
import { ICommentInteractionStats } from "@domain/models/comment-interaction.model";

export const commentInteractionAPI = createApi({
  reducerPath: "commentInteractionAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  tagTypes: ["CommentInteraction"],
  endpoints: (build) => ({
    getCommentStats: build.query<ICommentInteractionStats, { commentId: string; userId?: string }>({
      query: ({ commentId, userId }) => `/comments/interactions/stats?commentId=${commentId}&userId=${userId || ''}`,
      providesTags: (result, error, { commentId }) => [
        { type: "CommentInteraction", id: commentId },
        { type: "CommentInteraction", id: "LIST" },
      ],
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
});

export const {
  useGetCommentStatsQuery,
  useHandleCommentInteractionMutation,
  useGetUserCommentInteractionsQuery,
} = commentInteractionAPI;
