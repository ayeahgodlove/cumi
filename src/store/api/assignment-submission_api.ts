import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";

export interface IAssignmentSubmissionResponse {
  id: string;
  userId: string;
  assignmentId: string;
  courseId: string;
  moduleId?: string;
  lessonId?: string;
  submissionText?: string;
  fileUrls?: string; // JSON array
  score?: number;
  maxScore: number;
  percentage?: number;
  attemptNumber: number;
  isPassed: boolean;
  isLate: boolean;
  latePenaltyApplied?: number;
  submittedAt: string;
  gradedAt?: string;
  gradedBy?: string;
  status: 'submitted' | 'graded' | 'returned' | 'resubmitted';
  instructorFeedback?: string;
  rubricScores?: string; // JSON object
  peerReviewScores?: string; // JSON array
  plagiarismScore?: number;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  user?: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  assignment?: {
    id: string;
    title: string;
    assignmentType: string;
    dueDate: string;
    maxScore: number;
    passingScore: number;
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
  grader?: {
    id: string;
    name: string;
    username: string;
  };
}

export interface IAssignmentSubmissionRequest {
  assignmentId: string;
  courseId: string;
  moduleId?: string;
  lessonId?: string;
  submissionText?: string;
  fileUrls?: string[]; // Array of file URLs
  maxScore: number;
}

export interface IAssignmentGradeRequest {
  id: string;
  score: number;
  feedback?: string;
  rubricScores?: { [criterion: string]: number };
}

export interface IAssignmentStatistics {
  totalSubmissions: number;
  averageScore: number;
  passRate: number;
}

export const assignmentSubmissionAPI = createApi({
  reducerPath: "assignmentSubmissionAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ["AssignmentSubmission", "UserAssignmentSubmissions", "CourseAssignmentSubmissions"],
  endpoints: (build) => ({
    // Submit an assignment
    submitAssignment: build.mutation<IAssignmentSubmissionResponse, IAssignmentSubmissionRequest>({
      query: (submission) => ({
        url: "/assignment-submissions",
        method: "POST",
        body: {
          ...submission,
          fileUrls: JSON.stringify(submission.fileUrls || []),
        },
      }),
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || null;
      },
      invalidatesTags: (result, error, { courseId, assignmentId }) => [
        { type: "UserAssignmentSubmissions", id: "LIST" },
        { type: "CourseAssignmentSubmissions", id: courseId },
        { type: "AssignmentSubmission", id: assignmentId },
      ],
    }),

    // Grade an assignment
    gradeAssignment: build.mutation<IAssignmentSubmissionResponse, IAssignmentGradeRequest>({
      query: (gradeData) => ({
        url: "/assignment-submissions",
        method: "PUT",
        body: {
          action: "grade",
          ...gradeData,
          rubricScores: gradeData.rubricScores ? JSON.stringify(gradeData.rubricScores) : undefined,
        },
      }),
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || null;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "AssignmentSubmission", id },
        { type: "UserAssignmentSubmissions", id: "LIST" },
        { type: "CourseAssignmentSubmissions", id: "LIST" },
      ],
    }),

    // Get user's assignment submissions for a course
    getUserAssignmentSubmissions: build.query<IAssignmentSubmissionResponse[], { userId: string; courseId: string }>({
      query: ({ userId, courseId }) => `/assignment-submissions?userId=${userId}&courseId=${courseId}`,
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || [];
      },
      providesTags: (result, error, { courseId }) => [
        { type: "UserAssignmentSubmissions", id: "LIST" },
        { type: "CourseAssignmentSubmissions", id: courseId },
        ...(result || []).map(({ id }) => ({ type: "AssignmentSubmission" as const, id })),
      ],
    }),

    // Get all user's assignment submissions
    getAllUserAssignmentSubmissions: build.query<IAssignmentSubmissionResponse[], string>({
      query: (userId) => `/assignment-submissions?userId=${userId}`,
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || [];
      },
      providesTags: (result) => [
        { type: "UserAssignmentSubmissions", id: "LIST" },
        ...(result || []).map(({ id }) => ({ type: "AssignmentSubmission" as const, id })),
      ],
    }),

    // Get assignment submissions for a specific assignment
    getAssignmentSubmissions: build.query<IAssignmentSubmissionResponse[], string>({
      query: (assignmentId) => `/assignment-submissions?assignmentId=${assignmentId}`,
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || [];
      },
      providesTags: (result, error, assignmentId) => [
        { type: "AssignmentSubmission", id: assignmentId },
        ...(result || []).map(({ id }) => ({ type: "AssignmentSubmission" as const, id })),
      ],
    }),

    // Get course assignment submissions
    getCourseAssignmentSubmissions: build.query<IAssignmentSubmissionResponse[], string>({
      query: (courseId) => `/assignment-submissions?courseId=${courseId}`,
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || [];
      },
      providesTags: (result, error, courseId) => [
        { type: "CourseAssignmentSubmissions", id: courseId },
        ...(result || []).map(({ id }) => ({ type: "AssignmentSubmission" as const, id })),
      ],
    }),

    // Get pending submissions for grading
    getPendingSubmissions: build.query<IAssignmentSubmissionResponse[], void>({
      query: () => `/assignment-submissions?status=submitted`,
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return response || [];
      },
      providesTags: (result) => [
        { type: "AssignmentSubmission", id: "PENDING" },
        ...(result || []).map(({ id }) => ({ type: "AssignmentSubmission" as const, id })),
      ],
    }),
  }),
});

export const {
  useSubmitAssignmentMutation,
  useGradeAssignmentMutation,
  useGetUserAssignmentSubmissionsQuery,
  useGetAllUserAssignmentSubmissionsQuery,
  useGetAssignmentSubmissionsQuery,
  useGetCourseAssignmentSubmissionsQuery,
  useGetPendingSubmissionsQuery,
} = assignmentSubmissionAPI;
