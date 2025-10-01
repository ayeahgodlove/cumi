import { baseAPI } from "./base-api";
import { ICourse } from "@domain/models/course";

interface ISort {
  searchTitle: string;
  sortBy?: "date" | "title" | "category" | "level";
}

export const courseAPI = baseAPI.injectEndpoints({
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
  overrideExisting: true,
});

export const {
  useGetSingleCourseQuery,
  useGetSingleCourseBySlugQuery,
  useGetCoursesByCategoryQuery,
  useFetchAllCoursesQuery,
} = courseAPI;
