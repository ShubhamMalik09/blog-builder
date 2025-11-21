import { configureStore } from "@reduxjs/toolkit";
import tagsReducer from "./slices/tagSlice";

export const store = configureStore({
  reducer: {
    tags: tagsReducer,
  },
});

export default store;
