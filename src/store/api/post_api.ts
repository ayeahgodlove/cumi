import { baseAPI } from "./base-api";
import { IPost } from "@domain/models/post.model";

interface ISearchParams {
  searchTitle?: string;
  sortBy?: "date" | "title" | "author" | "createdAt" | "publishedAt";
  page?: number;
  limit?: number;
}

export const postAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSinglePost: build.query<IPost, string>({
      query: (postId) => `/posts/${postId}`,
    }),
    getSinglePostBySlug: build.query<IPost, string>({
      query: (slug) => `/posts/slugs/${slug}`,
    }),
    getPostsByCategory: build.query<IPost[], string>({
      query: (category) => `/posts/categories/${category}`,
    }),
    getPostsByTag: build.query<IPost[], string>({
      query: (tag) => `/posts/tags/${tag}`,
    }),
    fetchAllPosts: build.query<IPost[], ISearchParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.searchTitle) searchParams.append('searchTitle', params.searchTitle);
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        
        const queryString = searchParams.toString();
        return `/posts${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) => ["Post"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSinglePostQuery,
  useGetSinglePostBySlugQuery,
  useGetPostsByCategoryQuery,
  useGetPostsByTagQuery,
  useFetchAllPostsQuery,
} = postAPI;
