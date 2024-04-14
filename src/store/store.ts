import { configureStore } from "@reduxjs/toolkit";
import { postAPI } from "./api/post_api";
import { categoryAPI } from "./api/category_api";
import { tagAPI } from "./api/tag_api";
import { userAPI } from "./api/user_api";

export const store = configureStore({
  reducer: {
    [postAPI.reducerPath]: postAPI.reducer,
    [categoryAPI.reducerPath]: categoryAPI.reducer,
    [tagAPI.reducerPath]: tagAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      postAPI.middleware,
      categoryAPI.middleware,
      tagAPI.middleware,
      userAPI.middleware,
    ]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
