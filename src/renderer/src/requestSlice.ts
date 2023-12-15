import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type HttpVerb = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS"

export interface RequestState{
    httpVerb: HttpVerb,
    url: string,
    body?: string,
    queryParams?: [],
}

const initialState: RequestState = {
    httpVerb: "GET",
    url: "",
}

export const requestSlice = createSlice({
    name: "request",
    initialState,
    reducers: {
        updateUrl: (state, action: PayloadAction<string>) => {
            state.url = action.payload
        },
        updateVerb: (state, action: PayloadAction<HttpVerb>) => {
            state.httpVerb = action.payload
        },
    },
})

export const { updateUrl, updateVerb } = requestSlice.actions

export default requestSlice.reducer
