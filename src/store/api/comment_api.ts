import { baseAPI } from "./base-api";
import { IComment } from "@domain/models/comment.model";

export const commentAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getCommentsByPostId: build.query<IComment[], string>({
      query: (postId) => `/comments?postId=${postId}`,
      transformResponse: (response: any) => {
        // Handle the API response structure
        if (response && response.success && response.data) {
          return Array.isArray(response.data) ? response.data : [];
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      },
      providesTags: (result, error, postId) => [
        { type: "Comment", id: postId },
        { type: "Comment", id: "LIST" },
      ],
      keepUnusedDataFor: 120, // Keep comments cached for 2 minutes
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
  overrideExisting: true,
});

export const {
  useGetCommentsByPostIdQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentAPI;

