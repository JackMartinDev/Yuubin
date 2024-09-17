import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: Config = {
  dataPath: "",
  preserveOpenTabs: false,
  language: "en",
  theme: "dark",
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Config>) => {
      state.theme = action.payload.theme;
      state.language = action.payload.language;
      state.preserveOpenTabs = action.payload.preserveOpenTabs;
      state.dataPath = action.payload.dataPath;
    },
  },
});

export const { updateSettings } = configSlice.actions;

export default configSlice.reducer;
