import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ICourse } from "@domain/models/course.model";
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
    }),
    getSingleCourseBySlug: build.query<ICourse, string>({
      query: (slug) => `/courses/slugs/${slug}`,
    }),
    getCoursesByCategory: build.query<ICourse[], string>({
      query: (category) => `/courses/categories/${category}`,
    }),
    fetchAllCourses: build.query<ICourse[], number | ISort>({
      query: (page = 1) => `/courses?page=${page}`,
      providesTags: (result) => ["Course"],
    }),
  }),
});
