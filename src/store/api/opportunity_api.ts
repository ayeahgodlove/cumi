import { baseAPI } from "./base-api";
import { IOpportunity } from "@domain/models/opportunity.model";

export const opportunityAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSingleOpportunity: build.query<IOpportunity, string>({
      query: (opportunityId) => `/opportunities/${opportunityId}`,
    }),
    getSingleOpportunityBySlug: build.query<IOpportunity, string>({
      query: (slug) => `/opportunities/slugs/${slug}`,
    }),
    fetchAllOpportunities: build.query<IOpportunity[], number | void>({
      query: (page = 1) => `/opportunities?page=${page}`,
    }),
  }),
  overrideExisting: false,
});
