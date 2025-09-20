import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";

export interface IQuizSubmissionResponse {
  id: string;
  userId: string;
  quizId: string;
  lessonId: string;
  courseId: string;
  moduleId?: string;
  score: number;
  maxScore: number;
  percentage: number;
  answers: string; // JSON array
  correctAnswers: string; // JSON array
  timeSpentSeconds?: number;
  attemptNumber: number;
  isPassed: boolean;
  submittedAt: string;
  gradedAt?: string;
  status: 'submitted' | 'graded' | 'review';
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  user?: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  quiz?: {
    id: string;
    title: string;
    difficulty: string;
    points: number;
  };
  lesson?: {
    id: string;
    title: string;
    slug: string;
  };
  course?: {
    id: string;
    title: string;
    slug: string;
  };
  module?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface IQuizSubmissionRequest {
  quizId: string;
  lessonId: string;
  courseId: string;
  moduleId?: string;
  score: number;
  maxScore: number;
  percentage: number;
  answers: string; // JSON array
  correctAnswers: string; // JSON array
  timeSpentSeconds?: number;
  attemptNumber?: number;
  isPassed?: boolean;
  feedback?: string;
}

export interface IQuizStatistics {
  totalSubmissions: number;
  averageScore: number;
  passRate: number;
}

export const quizSubmissionAPI = createApi({
  reducerPath: "quizSubmissionAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ["QuizSubmission", "UserQuizSubmissions", "CourseQuizSubmissions"],
  endpoints: (build) => ({
    // Submit a quiz
    submitQuiz: build.mutation<IQuizSubmissionResponse, IQuizSubmissionRequest>({
      query: (submission) => ({
        url: "/quiz-submissions",
        method: "POST",
        body: submission,
      }),
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || null;
      },
      invalidatesTags: (result, error, { courseId, quizId }) => [
        { type: "UserQuizSubmissions", id: "LIST" },
        { type: "CourseQuizSubmissions", id: courseId },
        { type: "QuizSubmission", id: quizId },
      ],
    }),

    // Get user's quiz submissions for a course
    getUserQuizSubmissions: build.query<IQuizSubmissionResponse[], { userId: string; courseId: string }>({
      query: ({ userId, courseId }) => `/quiz-submissions?userId=${userId}&courseId=${courseId}`,
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || [];
      },
      providesTags: (result, error, { courseId }) => [
        { type: "UserQuizSubmissions", id: "LIST" },
        { type: "CourseQuizSubmissions", id: courseId },
        ...(result || []).map(({ id }) => ({ type: "QuizSubmission" as const, id })),
      ],
    }),

    // Get all user's quiz submissions
    getAllUserQuizSubmissions: build.query<IQuizSubmissionResponse[], string>({
      query: (userId) => `/quiz-submissions?userId=${userId}`,
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || [];
      },
      providesTags: (result) => [
        { type: "UserQuizSubmissions", id: "LIST" },
        ...(result || []).map(({ id }) => ({ type: "QuizSubmission" as const, id })),
      ],
    }),

    // Get quiz submissions for a specific quiz
    getQuizSubmissions: build.query<IQuizSubmissionResponse[], string>({
      query: (quizId) => `/quiz-submissions?quizId=${quizId}`,
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || [];
      },
      providesTags: (result, error, quizId) => [
        { type: "QuizSubmission", id: quizId },
        ...(result || []).map(({ id }) => ({ type: "QuizSubmission" as const, id })),
      ],
    }),

    // Get course quiz submissions
    getCourseQuizSubmissions: build.query<IQuizSubmissionResponse[], string>({
      query: (courseId) => `/quiz-submissions?courseId=${courseId}`,
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || [];
      },
      providesTags: (result, error, courseId) => [
        { type: "CourseQuizSubmissions", id: courseId },
        ...(result || []).map(({ id }) => ({ type: "QuizSubmission" as const, id })),
      ],
    }),
  }),
});

export const {
  useSubmitQuizMutation,
  useGetUserQuizSubmissionsQuery,
  useGetAllUserQuizSubmissionsQuery,
  useGetQuizSubmissionsQuery,
  useGetCourseQuizSubmissionsQuery,
} = quizSubmissionAPI;
