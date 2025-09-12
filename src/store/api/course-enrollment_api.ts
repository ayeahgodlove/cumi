import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";
import { ICourseEnrollment } from "@domain/models/course-enrollment.model";

interface ICourseEnrollmentSearchParams {
  courseId?: string;
  userId?: string;
  status?: 'active' | 'completed' | 'dropped' | 'suspended';
  paymentStatus?: 'pending' | 'paid' | 'partial' | 'free' | 'scholarship';
  page?: number;
  limit?: number;
}

export const courseEnrollmentAPI = createApi({
  reducerPath: "courseEnrollmentAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  tagTypes: ["CourseEnrollment"],
  endpoints: (build) => ({
    getSingleCourseEnrollment: build.query<ICourseEnrollment, string>({
      query: (enrollmentId) => `/course-enrollments/${enrollmentId}`,
      providesTags: (result, error, id) => [{ type: "CourseEnrollment", id }],
    }),
    getCourseEnrollmentsByCourse: build.query<ICourseEnrollment[], string>({
      query: (courseId) => `/course-enrollments?courseId=${courseId}`,
      providesTags: (result, error, courseId) => [
        { type: "CourseEnrollment", id: "LIST" },
        { type: "CourseEnrollment", id: courseId },
      ],
    }),
    getCourseEnrollmentsByUser: build.query<ICourseEnrollment[], string>({
      query: (userId) => `/course-enrollments?userId=${userId}`,
      providesTags: (result, error, userId) => [
        { type: "CourseEnrollment", id: "LIST" },
        { type: "CourseEnrollment", id: userId },
      ],
    }),
    getCourseEnrollmentsByStatus: build.query<ICourseEnrollment[], string>({
      query: (status) => `/course-enrollments?status=${status}`,
      providesTags: (result, error, status) => [
        { type: "CourseEnrollment", id: "LIST" },
        { type: "CourseEnrollment", id: status },
      ],
    }),
    fetchAllCourseEnrollments: build.query<{data: ICourseEnrollment[], total: number, page: number, limit: number, totalPages: number}, ICourseEnrollmentSearchParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.courseId) searchParams.append('courseId', params.courseId);
        if (params.userId) searchParams.append('userId', params.userId);
        if (params.status) searchParams.append('status', params.status);
        if (params.paymentStatus) searchParams.append('paymentStatus', params.paymentStatus);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        
        return `/course-enrollments?${searchParams.toString()}`;
      },
      providesTags: [{ type: "CourseEnrollment", id: "LIST" }],
    }),
    createCourseEnrollment: build.mutation<ICourseEnrollment, Partial<ICourseEnrollment>>({
      query: (enrollment) => ({
        url: "/course-enrollments",
        method: "POST",
        body: enrollment,
      }),
      invalidatesTags: [{ type: "CourseEnrollment", id: "LIST" }],
    }),
    updateCourseEnrollment: build.mutation<ICourseEnrollment, { id: string; enrollment: Partial<ICourseEnrollment> }>({
      query: ({ id, enrollment }) => ({
        url: `/course-enrollments/${id}`,
        method: "PATCH",
        body: enrollment,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "CourseEnrollment", id },
        { type: "CourseEnrollment", id: "LIST" },
      ],
    }),
    deleteCourseEnrollment: build.mutation<void, string>({
      query: (id) => ({
        url: `/course-enrollments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "CourseEnrollment", id },
        { type: "CourseEnrollment", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSingleCourseEnrollmentQuery,
  useGetCourseEnrollmentsByCourseQuery,
  useGetCourseEnrollmentsByUserQuery,
  useGetCourseEnrollmentsByStatusQuery,
  useFetchAllCourseEnrollmentsQuery,
  useCreateCourseEnrollmentMutation,
  useUpdateCourseEnrollmentMutation,
  useDeleteCourseEnrollmentMutation,
} = courseEnrollmentAPI;
