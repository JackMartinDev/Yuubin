import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const testFiles:Collection[] = [{"name":"col5","requests":[{"method":"POST","url":"https://jsonplaceholder.typicode.com/todos","body":"{name:Jack}","auth":undefined,"meta":{"name":"req2","sequence":1,"id":"3"}}]},{"name":"col","requests":[{"method":"GET","url":"www.facebook.com","body":undefined,"auth":undefined,"meta":{"name":"req2","sequence":2,"id":"2"}},{"method":"GET","url":"https://jsonplaceholder.typicode.com/todos/1","body":undefined,"auth":undefined,"meta":{"name":"req","sequence":3,"id":"1"}}]}] 

export interface RequestState{
    activeRequest: string
    activeRequests: string[]
    files: Collection[]
}

const initialState: RequestState = {
    activeRequest: "1",
    activeRequests: ["1","2","3"],
    files: testFiles 
}

export const requestSlice = createSlice({
    name: "request",
    initialState,
    reducers: {
        updateActiveRequest: (state, action: PayloadAction<string>) => {
            console.log("ActiveRequest state before update:" + state.activeRequest)
            state.activeRequest = action.payload
            console.log("ActiveRequest state after update:" + state.activeRequest)
        },
        updateRequests: (state, action: PayloadAction<string[]>) => {
            state.activeRequests = action.payload
        },
        updatefiles: (state, action: PayloadAction<Collection[]>) => {
            state.files= action.payload
        }
    },
})

export const {updateActiveRequest, updatefiles, updateRequests} = requestSlice.actions

export default requestSlice.reducer
