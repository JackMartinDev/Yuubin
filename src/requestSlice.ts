import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


export interface RequestState{
    httpVerb: HttpVerb,
    url: string,
    body?: string,
    queryParams: {key: string, value: string}[],
    activeRequest: string
}

const initialState: RequestState = {
    httpVerb: "GET",
    url: "",
    queryParams: [],
    activeRequest: "1"
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
        },
        updateBody: (state, action: PayloadAction<string | undefined>) => {
            state.body = action.payload
        },
        updateActiveRequest: (state, action: PayloadAction<string>) => {
            state.activeRequest = action.payload
        }


    },
})

export const { updateUrl, updateVerb, updateParams, updateBody, updateActiveRequest } = requestSlice.actions

export default requestSlice.reducer
