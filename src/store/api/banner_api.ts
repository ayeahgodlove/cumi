import { baseAPI } from "./base-api";
import { IBanner } from "@domain/models/banner.model";

export const bannerAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSingleBanner: build.query<IBanner, string>({
      query: (bannerId) => `/banners/${bannerId}`,
    }),
    fetchAllBanners: build.query<IBanner[], number | void>({
      query: (page = 1) => `/banners?page=${page}`,
    }),
  }),
  overrideExisting: false,
});
