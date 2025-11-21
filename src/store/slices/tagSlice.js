import { createSlice } from "@reduxjs/toolkit";

const tagsSlice = createSlice({
  name: "tags",
  initialState: {
    primaryTags: [],
    industries: [],
  },
  reducers: {
    setPrimaryTags(state, action) {
      state.primaryTags = action.payload;
    },
    setIndustries(state, action) {
      state.industries = action.payload;
    },
  },
});

export const { setPrimaryTags, setIndustries } = tagsSlice.actions;
export default tagsSlice.reducer;