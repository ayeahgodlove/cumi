import { baseAPI } from "./base-api";
import { IAssignment } from "@domain/models/assignment.model";

interface IAssignmentSearchParams {
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export const assignmentAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSingleAssignment: build.query<IAssignment, string>({
      query: (assignmentId) => `/assignments/${assignmentId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, id) => [{ type: "Assignment", id }],
    }),
    getAssignmentBySlug: build.query<IAssignment, string>({
      query: (slug) => `/assignments/slugs/${slug}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, slug) => [{ type: "Assignment", id: slug }],
    }),
    getAssignmentsByCourse: build.query<IAssignment[], string>({
      query: (courseId) => `/assignments?courseId=${courseId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, courseId) => [
        { type: "Assignment", id: "LIST" },
        { type: "Assignment", id: courseId },
      ],
    }),
    getAssignmentsByModule: build.query<IAssignment[], string>({
      query: (moduleId) => `/assignments?moduleId=${moduleId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, moduleId) => [
        { type: "Assignment", id: "LIST" },
        { type: "Assignment", id: moduleId },
      ],
    }),
    getAssignmentsByLesson: build.query<IAssignment[], string>({
      query: (lessonId) => `/assignments?lessonId=${lessonId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, lessonId) => [
        { type: "Assignment", id: "LIST" },
        { type: "Assignment", id: lessonId },
      ],
    }),
    getAssignmentsByUser: build.query<IAssignment[], string>({
      query: (userId) => `/assignments?userId=${userId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, userId) => [
        { type: "Assignment", id: "LIST" },
        { type: "Assignment", id: userId },
      ],
    }),
    fetchAllAssignments: build.query<{data: IAssignment[], total: number, page: number, limit: number, totalPages: number}, IAssignmentSearchParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.courseId) searchParams.append('courseId', params.courseId);
        if (params.moduleId) searchParams.append('moduleId', params.moduleId);
        if (params.lessonId) searchParams.append('lessonId', params.lessonId);
        if (params.userId) searchParams.append('userId', params.userId);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        
        return `/assignments?${searchParams.toString()}`;
      },
      transformResponse: (response: any) => response.data || response,
      providesTags: [{ type: "Assignment", id: "LIST" }],
    }),
    createAssignment: build.mutation<IAssignment, Partial<IAssignment>>({
      query: (assignment) => ({
        url: "/assignments",
        method: "POST",
        body: assignment,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: [{ type: "Assignment", id: "LIST" }],
    }),
    updateAssignment: build.mutation<IAssignment, { id: string; assignment: Partial<IAssignment> }>({
      query: ({ id, assignment }) => ({
        url: `/assignments/${id}`,
        method: "PATCH",
        body: assignment,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Assignment", id },
        { type: "Assignment", id: "LIST" },
      ],
    }),
    deleteAssignment: build.mutation<void, string>({
      query: (id) => ({
        url: `/assignments/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, id) => [
        { type: "Assignment", id },
        { type: "Assignment", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSingleAssignmentQuery,
  useGetAssignmentBySlugQuery,
  useGetAssignmentsByCourseQuery,
  useGetAssignmentsByModuleQuery,
  useGetAssignmentsByLessonQuery,
  useGetAssignmentsByUserQuery,
  useFetchAllAssignmentsQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} = assignmentAPI;
