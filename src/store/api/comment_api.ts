import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";
import { IComment } from "@domain/models/comment.model";

export const commentAPI = createApi({
  reducerPath: "commentAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  tagTypes: ["Comment"],
  endpoints: (build) => ({
    getCommentsByPostId: build.query<IComment[], string>({
      query: (postId) => `/comments?postId=${postId}`,
      providesTags: (result, error, postId) => [
        { type: "Comment", id: postId },
        { type: "Comment", id: "LIST" },
      ],
    }),
    createComment: build.mutation<IComment, { content: string; postId: string; parentId?: string }>({
      query: (comment) => ({
        url: "/comments",
        method: "POST",
        body: comment,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comment", id: postId },
        { type: "Comment", id: "LIST" },
      ],
    }),
    updateComment: build.mutation<IComment, { id: string; content: string; isApproved?: boolean }>({
      query: ({ id, ...comment }) => ({
        url: `/comments/${id}`,
        method: "PUT",
        body: comment,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Comment", id },
        { type: "Comment", id: "LIST" },
      ],
    }),
    deleteComment: build.mutation<void, string>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Comment", id },
        { type: "Comment", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCommentsByPostIdQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentAPI;
