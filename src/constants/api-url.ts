export const API_URL = "http://localhost:8000";
export const API_URL_UPLOADS_POSTS = "http://localhost:8000/uploads/posts";
export const API_URL_UPLOADS_DOCUMENTS =
  "http://localhost:8000/uploads/document";
export const API_URL_UPLOADS_EVENTS = "http://localhost:8000/uploads/events";
export const API_URL_UPLOADS_PROJECTS =
  "http://localhost:8000/uploads/projects";
export const API_URL_UPLOADS_BANNERS = "http://localhost:8000/uploads/banners";

export const TINYMCE_KEY = "jmee0ymvhn8xuoj51dz5vzj032x5887fw5aa4yojvi9pu68z";

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : "http://localhost:8000/api";
// : (`${protocol}//${host}` as string);
