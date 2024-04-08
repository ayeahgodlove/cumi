"use client";

import axios from "axios";
import dataProviderSimpleRest from "@refinedev/simple-rest";
import { TOKEN_KEY } from "@constants/constant";

export const API_URL = "http://localhost:8000/api";

const axiosInstance = () => {
  // const token = window.localStorage.getItem(TOKEN_KEY);
  let headers = {
    "Content-Type": "application/json",
    Authorization: "",
  };

  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return axios.create({
    // baseURL: API_URL, // Replace with your API base URL
    headers,
  });
};

export const dataProvider = dataProviderSimpleRest(API_URL, axiosInstance());
