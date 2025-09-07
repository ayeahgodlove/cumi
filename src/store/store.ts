import { configureStore } from "@reduxjs/toolkit";
import { postAPI } from "./api/post_api";
import { categoryAPI } from "./api/category_api";
import { tagAPI } from "./api/tag_api";
import { userAPI } from "./api/user_api";
import { eventAPI } from "./api/event_api";
import { courseAPI } from "./api/course_api";
import { projectAPI } from "./api/project_api";
import { bannerAPI } from "./api/banner_api";
import { serviceAPI } from "./api/service_api";
import { opportunityAPI } from "./api/opportunity_api";

export const store = configureStore({
  reducer: {
    [postAPI.reducerPath]: postAPI.reducer,
    [categoryAPI.reducerPath]: categoryAPI.reducer,
    [tagAPI.reducerPath]: tagAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [eventAPI.reducerPath]: eventAPI.reducer,
    [courseAPI.reducerPath]: courseAPI.reducer,
    [projectAPI.reducerPath]: projectAPI.reducer,
    [bannerAPI.reducerPath]: bannerAPI.reducer,
    [serviceAPI.reducerPath]: serviceAPI.reducer,
    [opportunityAPI.reducerPath]: opportunityAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      postAPI.middleware,
      categoryAPI.middleware,
      tagAPI.middleware,
      userAPI.middleware,
      eventAPI.middleware,
      courseAPI.middleware,
      projectAPI.middleware,
      bannerAPI.middleware,
      serviceAPI.middleware,
      opportunityAPI.middleware,
    ]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
