import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";
import { IModule } from "@domain/models/module.model";

interface IModuleSearchParams {
  courseId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export const moduleAPI = createApi({
  reducerPath: "moduleAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  tagTypes: ["Module"],
  endpoints: (build) => ({
    getSingleModule: build.query<IModule, string>({
      query: (moduleId) => `/modules/${moduleId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, id) => [{ type: "Module", id }],
    }),
    getModuleBySlug: build.query<IModule, string>({
      query: (slug) => `/modules/slugs/${slug}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, slug) => [{ type: "Module", id: slug }],
    }),
    getModulesByCourse: build.query<IModule[], string>({
      query: (courseId) => `/modules?courseId=${courseId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, courseId) => [
        { type: "Module", id: "LIST" },
        { type: "Module", id: courseId },
      ],
    }),
    getModulesByUser: build.query<IModule[], string>({
      query: (userId) => `/modules?userId=${userId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, userId) => [
        { type: "Module", id: "LIST" },
        { type: "Module", id: userId },
      ],
    }),
    fetchAllModules: build.query<{data: IModule[], total: number, page: number, limit: number, totalPages: number}, IModuleSearchParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.courseId) searchParams.append('courseId', params.courseId);
        if (params.userId) searchParams.append('userId', params.userId);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        
        return `/modules?${searchParams.toString()}`;
      },
      transformResponse: (response: any) => response.data || response,
      providesTags: [{ type: "Module", id: "LIST" }],
    }),
    createModule: build.mutation<IModule, Partial<IModule>>({
      query: (module) => ({
        url: "/modules",
        method: "POST",
        body: module,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: [{ type: "Module", id: "LIST" }],
    }),
    updateModule: build.mutation<IModule, { id: string; module: Partial<IModule> }>({
      query: ({ id, module }) => ({
        url: `/modules/${id}`,
        method: "PATCH",
        body: module,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: "Module", id },
        { type: "Module", id: "LIST" },
      ],
    }),
    deleteModule: build.mutation<void, string>({
      query: (id) => ({
        url: `/modules/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (result, error, id) => [
        { type: "Module", id },
        { type: "Module", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSingleModuleQuery,
  useGetModuleBySlugQuery,
  useGetModulesByCourseQuery,
  useGetModulesByUserQuery,
  useFetchAllModulesQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
} = moduleAPI;
