import { configureStore } from "@reduxjs/toolkit";
import tagsReducer from "./slices/tagsSlice";
import editorReducer from "./slices/editorSlice";

export const store = configureStore({
  reducer: {
    tags: tagsReducer,
    editor: editorReducer,
  },
});

export default store;
