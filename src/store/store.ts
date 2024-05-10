import { configureStore } from "@reduxjs/toolkit";
import requestReducer from "../requestSlice"
import responseReducer from "../responseSlice"
import configReducer from "../configSlice"

export const store = configureStore({
    reducer: {
        config: configReducer,
        request: requestReducer,
        response: responseReducer
    },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
