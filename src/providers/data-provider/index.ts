"use client";

import dataProviderSimpleRest, { axiosInstance } from "@refinedev/simple-rest";

const API_URL = "http://localhost:8000/api";

export const dataProvider = dataProviderSimpleRest(API_URL);
