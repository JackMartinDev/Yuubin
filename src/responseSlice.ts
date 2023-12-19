import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { HttpStatusCode } from "axios";

export interface ResponseState{
    response: string | null,
    status: HttpStatusCode | null,
    elapsed: number | null,
    size: number | null
}

const initialState: ResponseState = {
    response: null,
    status: null,
    elapsed: null,
    size: null
}

export const responseSlice = createSlice({
    name: "response",
    initialState,
    reducers: {
        updateResponse: (state, action: PayloadAction<string>) => {
            state.response = action.payload
        },
        updateStatus: (state, action: PayloadAction<HttpStatusCode>) => {
            state.status = action.payload
        },
        updateElapsed: (state, action: PayloadAction<number>) =>{
            state.elapsed = action.payload
        },
        updateSize: (state, action: PayloadAction<number>) => {
            state.size = action.payload
        }

    },
})

export const { updateResponse, updateStatus, updateElapsed, updateSize } = responseSlice.actions

export default responseSlice.reducer
