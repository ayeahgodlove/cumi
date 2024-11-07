import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";
import { IBanner } from "@domain/models/banner.model";

export const bannerAPI = createApi({
  reducerPath: "bannerAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  tagTypes: ["Banner"],
  endpoints: (build) => ({
    getSingleBanner: build.query<IBanner, string>({
      query: (bannerId) => `/banners/${bannerId}`,
    }),
    fetchAllBanners: build.query<IBanner[], number | void>({
      query: (page = 1) => `/banners?page=${page}`,
    }),
  }),
});
