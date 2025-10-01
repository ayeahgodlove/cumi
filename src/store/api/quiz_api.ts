import { baseAPI } from "./base-api";
import { IQuiz } from "@domain/models/quiz";

interface IQuizSearchParams {
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export const quizAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSingleQuiz: build.query<IQuiz, string>({
      query: (quizId) => `/quizes/${quizId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, id) => [{ type: "Quiz", id }],
    }),
    getQuizBySlug: build.query<IQuiz, string>({
      query: (slug) => `/quizes/slugs/${slug}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, slug) => [{ type: "Quiz", id: slug }],
    }),
    getQuizzesByCourse: build.query<IQuiz[], string>({
      query: (courseId) => `/quizes?courseId=${courseId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, courseId) => [
        { type: "Quiz", id: "LIST" },
        { type: "Quiz", id: courseId },
      ],
    }),
    getQuizzesByModule: build.query<IQuiz[], string>({
      query: (moduleId) => `/quizes?moduleId=${moduleId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, moduleId) => [
        { type: "Quiz", id: "LIST" },
        { type: "Quiz", id: moduleId },
      ],
    }),
    getQuizzesByLesson: build.query<IQuiz[], string>({
      query: (lessonId) => `/quizes?lessonId=${lessonId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, lessonId) => [
        { type: "Quiz", id: "LIST" },
        { type: "Quiz", id: lessonId },
      ],
    }),
    getQuizzesByUser: build.query<IQuiz[], string>({
      query: (userId) => `/quizes?userId=${userId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, userId) => [
        { type: "Quiz", id: "LIST" },
        { type: "Quiz", id: userId },
      ],
    }),
    fetchAllQuizzes: build.query<{data: IQuiz[], total: number, page: number, limit: number, totalPages: number}, IQuizSearchParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.courseId) searchParams.append('courseId', params.courseId);
        if (params.moduleId) searchParams.append('moduleId', params.moduleId);
        if (params.lessonId) searchParams.append('lessonId', params.lessonId);
        if (params.userId) searchParams.append('userId', params.userId);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        
        return `/quizes?${searchParams.toString()}`;
      },
      transformResponse: (response: any) => response.data || response,
      providesTags: [{ type: "Quiz", id: "LIST" }],
    }),
    createQuiz: build.mutation<IQuiz, Partial<IQuiz>>({
      query: (quiz) => ({
        url: "/quizes",
        method: "POST",
        body: quiz,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: [{ type: "Quiz", id: "LIST" }],
    }),
    updateQuiz: build.mutation<IQuiz, { id: string; quiz: Partial<IQuiz> }>({
      query: ({ id, quiz }) => ({
        url: `/quizes/${id}`,
        method: "PATCH",
        body: quiz,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Quiz", id },
        { type: "Quiz", id: "LIST" },
      ],
    }),
    deleteQuiz: build.mutation<void, string>({
      query: (id) => ({
        url: `/quizes/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, id) => [
        { type: "Quiz", id },
        { type: "Quiz", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSingleQuizQuery,
  useGetQuizBySlugQuery,
  useGetQuizzesByCourseQuery,
  useGetQuizzesByModuleQuery,
  useGetQuizzesByLessonQuery,
  useGetQuizzesByUserQuery,
  useFetchAllQuizzesQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
} = quizAPI;
