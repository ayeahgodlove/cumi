import { baseAPI } from "./base-api";
import { IBanner } from "@domain/models/banner.model";

export const bannerAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSingleBanner: build.query<IBanner, string>({
      query: (bannerId) => `/banners/${bannerId}`,
      keepUnusedDataFor: 600, // Cache for 10 minutes (banners change infrequently)
    }),
    fetchAllBanners: build.query<IBanner[], number | void>({
      query: (page = 1) => `/banners?page=${page}`,
      keepUnusedDataFor: 600, // Cache for 10 minutes
    }),
  }),
  overrideExisting: true,
});
