import { configureStore } from "@reduxjs/toolkit";
import { postAPI } from "./api/post_api";

export const store = configureStore({
  reducer: {
    [postAPI.reducerPath]: postAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([postAPI.middleware]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
