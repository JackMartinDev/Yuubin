import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface RequestState {
  activeRequest: string;
  activeRequests: string[];
  files: Collection[];
}

const initialState: RequestState = {
  activeRequest: "",
  activeRequests: [],
  files: [],
};

export const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    updateActiveRequest: (state, action: PayloadAction<string>) => {
      console.log("ActiveRequest state before update:" + state.activeRequest);
      state.activeRequest = action.payload;
      console.log("ActiveRequest state after update:" + state.activeRequest);
    },
    updateRequests: (state, action: PayloadAction<string[]>) => {
      state.activeRequests = action.payload;
    },
    updatefiles: (state, action: PayloadAction<Collection[]>) => {
      state.files = action.payload;
    },
  },
});

export const { updateActiveRequest, updatefiles, updateRequests } =
  requestSlice.actions;

export default requestSlice.reducer;
