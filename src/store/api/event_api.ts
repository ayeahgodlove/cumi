import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IEvent } from "@domain/models/event.model";
import { BASE_URL } from "@constants/api-url";

interface ISort {
  searchTitle: string;
  sortBy?: "date" | "title" | "category";
}

export const eventAPI = createApi({
  reducerPath: "eventAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  tagTypes: ["Event"],
  endpoints: (build) => ({
    getSingleEvent: build.query<IEvent, string>({
      query: (eventId) => `/events/${eventId}`,
    }),
    getSingleEventBySlug: build.query<IEvent, string>({
      query: (slug) => `/events/slugs/${slug}`,
    }),
    getEventsByCategory: build.query<IEvent[], string>({
      query: (category) => `/events/categories/${category}`,
    }),
    fetchAllEvents: build.query<IEvent[], number | ISort>({
      query: (page = 1) => `/events?page=${page}`,
      providesTags: (result) => ["Event"],
    }),
  }),
});

export const {
  useGetSingleEventQuery,
  useGetSingleEventBySlugQuery,
  useFetchAllEventsQuery,
} = eventAPI;