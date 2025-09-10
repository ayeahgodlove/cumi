import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IProfessional } from '@domain/models/professional.model';

export const professionalAPI = createApi({
  reducerPath: 'professionalAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/professionals',
    prepareHeaders: (headers) => {
      // Add auth headers if needed
      return headers;
    },
  }),
  tagTypes: ['Professional'],
  endpoints: (builder) => ({
    getAllProfessionals: builder.query<IProfessional[], void>({
      query: () => '',
      providesTags: ['Professional'],
    }),
    getProfessionalById: builder.query<IProfessional, string>({
      query: (id) => `/${id}`,
      providesTags: ['Professional'],
    }),
    createProfessional: builder.mutation<IProfessional, Partial<IProfessional>>({
      query: (professional) => ({
        url: '',
        method: 'POST',
        body: professional,
      }),
      invalidatesTags: ['Professional'],
    }),
    updateProfessional: builder.mutation<IProfessional, { id: string; professional: Partial<IProfessional> }>({
      query: ({ id, professional }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: professional,
      }),
      invalidatesTags: ['Professional'],
    }),
    deleteProfessional: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Professional'],
    }),
    getVerifiedProfessionals: builder.query<IProfessional[], void>({
      query: () => '/verified',
      providesTags: ['Professional'],
    }),
    getActiveProfessionals: builder.query<IProfessional[], void>({
      query: () => '/active',
      providesTags: ['Professional'],
    }),
    getProfessionalsByLocation: builder.query<IProfessional[], string>({
      query: (location) => `/location/${location}`,
      providesTags: ['Professional'],
    }),
    getProfessionalsBySkills: builder.query<IProfessional[], string[]>({
      query: (skills) => `/skills?skills=${skills.join(',')}`,
      providesTags: ['Professional'],
    }),
  }),
});

export const {
  useGetAllProfessionalsQuery,
  useGetProfessionalByIdQuery,
  useCreateProfessionalMutation,
  useUpdateProfessionalMutation,
  useDeleteProfessionalMutation,
  useGetVerifiedProfessionalsQuery,
  useGetActiveProfessionalsQuery,
  useGetProfessionalsByLocationQuery,
  useGetProfessionalsBySkillsQuery,
} = professionalAPI;
