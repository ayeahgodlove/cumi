import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";
import { IPostInteractionStats } from "@domain/models/post-interaction.model";

export const postInteractionAPI = createApi({
  reducerPath: "postInteractionAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  tagTypes: ["PostInteraction"],
  endpoints: (build) => ({
    getPostStats: build.query<IPostInteractionStats, { postId: string; userId?: string }>({
      query: ({ postId, userId }) => `/posts/interactions/stats?postId=${postId}&userId=${userId || ''}`,
      providesTags: (result, error, { postId }) => [
        { type: "PostInteraction", id: postId },
        { type: "PostInteraction", id: "LIST" },
      ],
    }),
    handlePostInteraction: build.mutation<IPostInteractionStats, { postId: string; action: 'like' | 'dislike' }>({
      query: ({ postId, action }) => ({
        url: "/posts/interactions",
        method: "POST",
        body: { postId, action },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "PostInteraction", id: postId },
        { type: "PostInteraction", id: "LIST" },
      ],
    }),
    getUserPostInteractions: build.query<any[], string>({
      query: (userId) => `/posts/interactions/user/${userId}`,
      providesTags: (result, error, userId) => [
        { type: "PostInteraction", id: userId },
        { type: "PostInteraction", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPostStatsQuery,
  useHandlePostInteractionMutation,
  useGetUserPostInteractionsQuery,
} = postInteractionAPI;
