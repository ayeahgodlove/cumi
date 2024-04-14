import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";
import { IEvent } from "@models/event";

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
    fetchAllEvents: build.query<IEvent[], number | void>({
      query: (page = 1) => `/events?page=${page}`,
    }),
  }),
});
