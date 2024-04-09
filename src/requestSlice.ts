import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const testRequests: YuubinRequest[] = [{"method":"POST","url":"https://jsonplaceholder.typicode.com/todos","body":'{"name":"Jack"}',"auth":undefined,"meta":{"name":"req2","sequence":1, "id": "3"}},{"method":"GET","url":"www.facebook.com","body":undefined,"auth":undefined,"meta":{"name":"req2","sequence":2, "id": "2"}},{"method":"GET","url":"https://jsonplaceholder.typicode.com/todos/1","body":undefined,"auth":"Bearer 12345","meta":{"name":"req","sequence":3, "id": "1"}}]

export interface RequestState{
    activeRequest: string
    activeTabs: YuubinRequest[]
}

const initialState: RequestState = {
    activeRequest: "1",
    activeTabs: testRequests
}

export const requestSlice = createSlice({
    name: "request",
    initialState,
    reducers: {
        updateActiveRequest: (state, action: PayloadAction<string>) => {
            state.activeRequest = action.payload
        },
        updateActiveTabs: (state, action: PayloadAction<YuubinRequest[]>) => {
            state.activeTabs = action.payload
        }
    },
})

export const {updateActiveRequest, updateActiveTabs} = requestSlice.actions

export default requestSlice.reducer
