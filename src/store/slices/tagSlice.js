import { createSlice } from "@reduxjs/toolkit";

const tagsSlice = createSlice({
  name: "tags",
  initialState: {
    primary: [],
    secondary: [],
  },
  reducers: {
    setPrimaryTags(state, action) {
      state.primary = action.payload;
    },
    setSecondaryTags(state, action) {
      state.secondary = action.payload;
    },
  },
});

export const { setPrimaryTags, setSecondaryTags } = tagsSlice.actions;
export default tagsSlice.reducer;