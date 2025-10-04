import { baseAPI } from "./base-api";
import { ILesson } from "@domain/models/lesson";

interface ILessonSearchParams {
  courseId?: string;
  moduleId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export const lessonAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSingleLesson: build.query<ILesson, string>({
      query: (lessonId) => `/lessons/${lessonId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, id) => [{ type: "Lesson", id }],
    }),
    getLessonBySlug: build.query<ILesson, string>({
      query: (slug) => `/lessons/slugs/${slug}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, slug) => [{ type: "Lesson", id: slug }],
    }),
    getLessonsByCourse: build.query<ILesson[], string>({
      query: (courseId) => `/lessons?courseId=${courseId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, courseId) => [
        { type: "Lesson", id: "LIST" },
        { type: "Lesson", id: courseId },
      ],
    }),
    getLessonsByModule: build.query<ILesson[], string>({
      query: (moduleId) => `/lessons?moduleId=${moduleId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, moduleId) => [
        { type: "Lesson", id: "LIST" },
        { type: "Lesson", id: moduleId },
      ],
    }),
    getLessonsByUser: build.query<ILesson[], string>({
      query: (userId) => `/lessons?userId=${userId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, userId) => [
        { type: "Lesson", id: "LIST" },
        { type: "Lesson", id: userId },
      ],
    }),
    fetchAllLessons: build.query<{data: ILesson[], total: number, page: number, limit: number, totalPages: number}, ILessonSearchParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.courseId) searchParams.append('courseId', params.courseId);
        if (params.moduleId) searchParams.append('moduleId', params.moduleId);
        if (params.userId) searchParams.append('userId', params.userId);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        
        return `/lessons?${searchParams.toString()}`;
      },
      transformResponse: (response: any) => response.data || response,
      providesTags: [{ type: "Lesson", id: "LIST" }],
    }),
    createLesson: build.mutation<ILesson, Partial<ILesson>>({
      query: (lesson) => ({
        url: "/lessons",
        method: "POST",
        body: lesson,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: [{ type: "Lesson", id: "LIST" }],
    }),
    updateLesson: build.mutation<ILesson, { id: string; lesson: Partial<ILesson> }>({
      query: ({ id, lesson }) => ({
        url: `/lessons/${id}`,
        method: "PATCH",
        body: lesson,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Lesson", id },
        { type: "Lesson", id: "LIST" },
      ],
    }),
    deleteLesson: build.mutation<void, string>({
      query: (id) => ({
        url: `/lessons/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, id) => [
        { type: "Lesson", id },
        { type: "Lesson", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSingleLessonQuery,
  useGetLessonBySlugQuery,
  useGetLessonsByCourseQuery,
  useGetLessonsByModuleQuery,
  useGetLessonsByUserQuery,
  useFetchAllLessonsQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonAPI;

