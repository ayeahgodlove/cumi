import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IPartner } from '@domain/models/partner.model';

export const partnerAPI = createApi({
  reducerPath: 'partnerAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/partners',
    prepareHeaders: (headers) => {
      // Add auth headers if needed
      return headers;
    },
  }),
  tagTypes: ['Partner'],
  endpoints: (builder) => ({
    getAllPartners: builder.query<IPartner[], void>({
      query: () => '',
      providesTags: ['Partner'],
    }),
    getPartnerById: builder.query<IPartner, string>({
      query: (id) => `/${id}`,
      providesTags: ['Partner'],
    }),
    createPartner: builder.mutation<IPartner, Partial<IPartner>>({
      query: (partner) => ({
        url: '',
        method: 'POST',
        body: partner,
      }),
      invalidatesTags: ['Partner'],
    }),
    updatePartner: builder.mutation<IPartner, { id: string; partner: Partial<IPartner> }>({
      query: ({ id, partner }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: partner,
      }),
      invalidatesTags: ['Partner'],
    }),
    deletePartner: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Partner'],
    }),
    getPartnersByLocation: builder.query<IPartner[], string>({
      query: (location) => `/location/${location}`,
      providesTags: ['Partner'],
    }),
  }),
});

export const {
  useGetAllPartnersQuery,
  useGetPartnerByIdQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
  useGetPartnersByLocationQuery,
} = partnerAPI;
