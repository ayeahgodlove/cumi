import { baseAPI } from './base-api';
import { IPartner } from '@domain/models/partner.model';

export const partnerAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllPartners: builder.query<IPartner[], void>({
      query: () => '/public-partners',
      providesTags: ['Partner'],
      transformResponse: (response: any) => response?.data || response || [],
    }),
    getPartnerById: builder.query<IPartner, string>({
      query: (id) => `/partners/${id}`,
      providesTags: ['Partner'],
    }),
    createPartner: builder.mutation<IPartner, Partial<IPartner>>({
      query: (partner) => ({
        url: '/partners',
        method: 'POST',
        body: partner,
      }),
      invalidatesTags: ['Partner'],
    }),
    updatePartner: builder.mutation<IPartner, { id: string; partner: Partial<IPartner> }>({
      query: ({ id, partner }) => ({
        url: `/partners/${id}`,
        method: 'PUT',
        body: partner,
      }),
      invalidatesTags: ['Partner'],
    }),
    deletePartner: builder.mutation<void, string>({
      query: (id) => ({
        url: `/partners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Partner'],
    }),
    getPartnersByLocation: builder.query<IPartner[], string>({
      query: (location) => `/partners/location/${location}`,
      providesTags: ['Partner'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllPartnersQuery,
  useGetPartnerByIdQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
  useGetPartnersByLocationQuery,
} = partnerAPI;

