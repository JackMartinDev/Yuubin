import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


const testRequests: YuubinRequest[] = [{"method":"POST","url":"https://jsonplaceholder.typicode.com/todos","body":'{"name":"Jack"}',"auth":undefined,"meta":{"name":"req2","sequence":1, "id": "3"}},{"method":"GET","url":"www.facebook.com","body":undefined,"auth":undefined,"meta":{"name":"req2","sequence":2, "id": "2"}},{"method":"GET","url":"https://jsonplaceholder.typicode.com/todos/1","body":undefined,"auth":"Bearer 12345","meta":{"name":"req","sequence":3, "id": "1"}}]

export interface RequestState{
    httpVerb: HttpVerb,
    url: string,
    body?: string,
    queryParams: {key: string, value: string}[],
    activeRequest: string
    activeTabs: YuubinRequest[]
}

const initialState: RequestState = {
    httpVerb: "GET",
    url: "",
    queryParams: [],
    activeRequest: "1",
    activeTabs: testRequests
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
        },
        updateActiveTabs: (state, action: PayloadAction<YuubinRequest[]>) => {
            state.activeTabs = action.payload
        }



    },
})

export const { updateUrl, updateVerb, updateParams, updateBody, updateActiveRequest, updateActiveTabs} = requestSlice.actions

export default requestSlice.reducer
