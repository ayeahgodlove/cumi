import { baseAPI } from "./base-api";
import { ICourseProgress } from "@domain/models/course-progress.model";

interface ICourseProgressSearchParams {
  userId?: string;
  courseId?: string;
  enrollmentId?: string;
  moduleId?: string;
  lessonId?: string;
  assignmentId?: string;
  quizId?: string;
  page?: number;
  limit?: number;
}

export const courseProgressAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSingleCourseProgress: build.query<ICourseProgress, string>({
      query: (progressId) => `/course-progress/${progressId}`,
      providesTags: (result, error, id) => [{ type: "CourseProgress", id }],
    }),
    getCourseProgressByUser: build.query<ICourseProgress[], string>({
      query: (userId) => `/course-progress?userId=${userId}`,
      providesTags: (result, error, userId) => [
        { type: "CourseProgress", id: "LIST" },
        { type: "CourseProgress", id: userId },
      ],
    }),
    getCourseProgressByCourse: build.query<ICourseProgress[], string>({
      query: (courseId) => `/course-progress?courseId=${courseId}`,
      providesTags: (result, error, courseId) => [
        { type: "CourseProgress", id: "LIST" },
        { type: "CourseProgress", id: courseId },
      ],
    }),
    getCourseProgressByEnrollment: build.query<ICourseProgress[], string>({
      query: (enrollmentId) => `/course-progress?enrollmentId=${enrollmentId}`,
      providesTags: (result, error, enrollmentId) => [
        { type: "CourseProgress", id: "LIST" },
        { type: "CourseProgress", id: enrollmentId },
      ],
    }),
    getCourseProgressByModule: build.query<ICourseProgress[], string>({
      query: (moduleId) => `/course-progress?moduleId=${moduleId}`,
      providesTags: (result, error, moduleId) => [
        { type: "CourseProgress", id: "LIST" },
        { type: "CourseProgress", id: moduleId },
      ],
    }),
    getCourseProgressByLesson: build.query<ICourseProgress[], string>({
      query: (lessonId) => `/course-progress?lessonId=${lessonId}`,
      providesTags: (result, error, lessonId) => [
        { type: "CourseProgress", id: "LIST" },
        { type: "CourseProgress", id: lessonId },
      ],
    }),
    getCourseProgressByAssignment: build.query<ICourseProgress[], string>({
      query: (assignmentId) => `/course-progress?assignmentId=${assignmentId}`,
      providesTags: (result, error, assignmentId) => [
        { type: "CourseProgress", id: "LIST" },
        { type: "CourseProgress", id: assignmentId },
      ],
    }),
    fetchAllCourseProgress: build.query<{data: ICourseProgress[], total: number, page: number, limit: number, totalPages: number}, ICourseProgressSearchParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.userId) searchParams.append('userId', params.userId);
        if (params.courseId) searchParams.append('courseId', params.courseId);
        if (params.enrollmentId) searchParams.append('enrollmentId', params.enrollmentId);
        if (params.moduleId) searchParams.append('moduleId', params.moduleId);
        if (params.lessonId) searchParams.append('lessonId', params.lessonId);
        if (params.assignmentId) searchParams.append('assignmentId', params.assignmentId);
        if (params.quizId) searchParams.append('quizId', params.quizId);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        
        return `/course-progress?${searchParams.toString()}`;
      },
      providesTags: [{ type: "CourseProgress", id: "LIST" }],
    }),
    createCourseProgress: build.mutation<ICourseProgress, Partial<ICourseProgress>>({
      query: (courseProgress) => ({
        url: "/course-progress",
        method: "POST",
        body: courseProgress,
      }),
      invalidatesTags: [{ type: "CourseProgress", id: "LIST" }],
    }),
    updateCourseProgress: build.mutation<ICourseProgress, { id: string; courseProgress: Partial<ICourseProgress> }>({
      query: ({ id, courseProgress }) => ({
        url: `/course-progress/${id}`,
        method: "PATCH",
        body: courseProgress,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "CourseProgress", id },
        { type: "CourseProgress", id: "LIST" },
      ],
    }),
    deleteCourseProgress: build.mutation<void, string>({
      query: (id) => ({
        url: `/course-progress/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "CourseProgress", id },
        { type: "CourseProgress", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSingleCourseProgressQuery,
  useGetCourseProgressByUserQuery,
  useGetCourseProgressByCourseQuery,
  useGetCourseProgressByEnrollmentQuery,
  useGetCourseProgressByModuleQuery,
  useGetCourseProgressByLessonQuery,
  useGetCourseProgressByAssignmentQuery,
  useFetchAllCourseProgressQuery,
  useCreateCourseProgressMutation,
  useUpdateCourseProgressMutation,
  useDeleteCourseProgressMutation,
} = courseProgressAPI;
