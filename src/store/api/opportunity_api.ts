import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@constants/api-url";
import { IOpportunity } from "@domain/models/opportunity.model";

export const opportunityAPI = createApi({
  reducerPath: "opportunityAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),
  tagTypes: ["Opportunity"],
  endpoints: (build) => ({
    getSingleOpportunity: build.query<IOpportunity, string>({
      query: (opportunityId) => `/opportunities/${opportunityId}`,
    }),
    fetchAllOpportunities: build.query<IOpportunity[], number | void>({
      query: (page = 1) => `/opportunities?page=${page}`,
    }),
  }),
});
