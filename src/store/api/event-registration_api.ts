import { baseAPI } from "./base-api";

export interface IEventRegistration {
  id: string;
  eventId: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  dietaryRequirements?: string;
  additionalNotes?: string;
  paymentAmount?: number;
  paymentMethod?: string;
  registrationDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export const eventRegistrationAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getUserEventRegistrations: build.query<IEventRegistration[], string>({
      query: (userId) => `/event-registrations?userId=${userId}`,
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return Array.isArray(response.data) ? response.data : [];
        }
        return response || [];
      },
      providesTags: ["EventRegistration"],
    }),
    checkEventRegistration: build.query<{ registered: boolean }, string>({
      query: (eventId) => `/event-registrations?eventId=${eventId}`,
      providesTags: ["EventRegistration"],
    }),
    getEventRegistrationsByEvent: build.query<IEventRegistration[], string>({
      query: (eventId) => `/event-registrations?eventId=${eventId}`,
      transformResponse: (response: any) => {
        if (response && response.success && response.data) {
          return Array.isArray(response.data) ? response.data : [];
        }
        return response || [];
      },
      providesTags: (result, error, eventId) => [
        { type: "EventRegistration", id: eventId },
        { type: "EventRegistration", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetUserEventRegistrationsQuery, 
  useCheckEventRegistrationQuery,
  useGetEventRegistrationsByEventQuery,
} = eventRegistrationAPI;
