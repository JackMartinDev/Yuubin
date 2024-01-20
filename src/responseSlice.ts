import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { HttpStatusCode } from "axios";

export interface ResponseState{
    response: string | null,
    status: HttpStatusCode | null,
    elapsed: number | null,
    size: string | null,
    headers: string | null,
    loading: boolean,
}

const initialState: ResponseState = {
    response: null,
    status: null,
    elapsed: null,
    size: null,
    headers: null,
    loading: false,
}

export const responseSlice = createSlice({
    name: "response",
    initialState,
    reducers: {
        updateResponse: (state, action: PayloadAction<string | null>) => {
            state.response = action.payload
        },
        updateStatus: (state, action: PayloadAction<HttpStatusCode>) => {
            state.status = action.payload
        },
        updateElapsed: (state, action: PayloadAction<number>) =>{
            state.elapsed = action.payload
        },
        updateSize: (state, action: PayloadAction<string>) => {
            state.size = action.payload
        },
        updateHeaders: (state, action: PayloadAction<string>) => {
            state.headers = action.payload
        },
        updateLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        }


    },
})

export const { updateResponse, updateStatus, updateElapsed, updateSize, updateHeaders, updateLoading } = responseSlice.actions

export default responseSlice.reducer
