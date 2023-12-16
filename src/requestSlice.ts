import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type HttpVerb = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"  | "OPTIONS" | "HEAD"

export interface RequestState{
    httpVerb: HttpVerb,
    url: string,
    body?: string,
    queryParams?: {key: string, value: string}[],
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
        updateParams: (state, action: PayloadAction<{key: string, value:string}[]>) =>{
            state.queryParams = action.payload
        }
    },
})

export const { updateUrl, updateVerb, updateParams } = requestSlice.actions

export default requestSlice.reducer
