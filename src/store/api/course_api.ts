import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ICourse } from "@domain/models/course";
import { BASE_URL } from "@constants/api-url";

interface ISort {
  searchTitle: string;
  sortBy?: "date" | "title" | "category" | "level";
}

export const courseAPI = createApi({
  reducerPath: "courseAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  tagTypes: ["Course"],
  endpoints: (build) => ({
    getSingleCourse: build.query<ICourse, string>({
      query: (courseId) => `/courses/${courseId}`,
      transformResponse: (response: any) => response.data || response,
    }),
    getSingleCourseBySlug: build.query<ICourse, string>({
      query: (slug) => `/courses/slugs/${slug}`,
      transformResponse: (response: any) => response.data || response,
    }),
    getCoursesByCategory: build.query<ICourse[], string>({
      query: (category) => `/courses/categories/${category}`,
      transformResponse: (response: any) => response.data || response,
    }),
    fetchAllCourses: build.query<ICourse[], number | ISort>({
      query: (page = 1) => `/courses?page=${page}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result) => ["Course"],
    }),
  }),
});

export const {
  useGetSingleCourseQuery,
  useGetSingleCourseBySlugQuery,
  useGetCoursesByCategoryQuery,
  useFetchAllCoursesQuery,
} = courseAPI;
