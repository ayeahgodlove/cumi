import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "../constants/api-url";
import { TOKEN_KEY } from "@constants/constant";

const apiHeaders = {
  baseURL: `${BASE_URL}`,
  headers: {
    Accept: "application/json",
    Authorization: "",
  },
};

const apiConfig = () => {
  const token = JSON.parse(window.localStorage.getItem(TOKEN_KEY)!);

  apiHeaders.headers["Authorization"] = `Bearer ${token}`;
  return apiHeaders;
};

const responseBody = (response: AxiosResponse) => response.data;

export const requestType = {
  get: (url: string) => axios.get(url, apiConfig()).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body, apiConfig()).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body, apiConfig()).then(responseBody),
  del: (url: string, body: {}) =>
    axios
      .delete(apiConfig().baseURL + url, {
        headers: apiConfig().headers,
        data: body,
      })
      .then(responseBody),
};
