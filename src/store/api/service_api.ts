import { baseAPI } from "./base-api";
import { IService } from "@domain/models/service.model";

export const serviceAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSingleService: build.query<IService, string>({
      query: (serviceId) => `/services/${serviceId}`,
    }),
    getServiceBySlug: build.query<IService, string>({
      query: (slug) => `/services/slugs/${slug}`,
    }),
    fetchAllServices: build.query({
      query: (page = 1) => `/services?page=${page}`,
      providesTags: ["Service"],
    }),
  }),
  overrideExisting: true,
});

