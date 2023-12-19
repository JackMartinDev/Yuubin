import { configureStore } from "@reduxjs/toolkit";
import requestReducer from "../requestSlice"
import responseReducer from "../responseSlice"

export const store = configureStore({
    reducer: {
        request: requestReducer,
        response: responseReducer
    },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
