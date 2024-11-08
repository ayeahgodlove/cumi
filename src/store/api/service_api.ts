import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";
import { IService } from "@domain/models/service.model";

export const serviceAPI = createApi({
  reducerPath: "serviceAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  tagTypes: ["Service"],
  endpoints: (build) => ({
    getSingleService: build.query<IService, string>({
      query: (serviceId) => `/services/${serviceId}`,
    }),
    getServiceBySlug: build.query<IService, string>({
      query: (slug) => `/services/slugs/${slug}`,
    }),
    fetchAllServices: build.query<IService[], number | void>({
      query: (page = 1) => `/services?page=${page}`,
    }),
  }),
});
