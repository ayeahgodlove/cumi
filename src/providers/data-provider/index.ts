"use client";

import dataProviderSimpleRest from "@refinedev/simple-rest";
import { BASE_URL } from "@constants/api-url";


export const dataProvider = dataProviderSimpleRest(BASE_URL);
