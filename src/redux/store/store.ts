import { configureStore } from "@reduxjs/toolkit";
import requestReducer from "../slice/requestSlice";
import responseReducer from "../slice/responseSlice";
import configReducer from "../slice/configSlice";

export const store = configureStore({
  reducer: {
    config: configReducer,
    request: requestReducer,
    response: responseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
