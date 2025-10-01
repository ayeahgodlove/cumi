import { baseAPI } from "./base-api";
import { IEvent } from "@domain/models/event.model";

interface ISort {
  searchTitle: string;
  sortBy?: "date" | "title" | "category";
}

export const eventAPI = baseAPI.injectEndpoints({
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
  overrideExisting: false,
});

export const {
  useGetSingleEventQuery,
  useGetSingleEventBySlugQuery,
  useFetchAllEventsQuery,
} = eventAPI;