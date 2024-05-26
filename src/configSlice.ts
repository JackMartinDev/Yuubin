import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ConfigState{
    config: Config
}

const initialState: Config = {
    activeTabs: ["1", "2"],
    dataPath: "",
    preserveOpenTabs: false,
    language: "en",
    theme: "dark"
}

export const configSlice = createSlice({
    name: "config",
    initialState,
    reducers: {
        updateSettings: (state, action: PayloadAction<Settings>) => {
            state.theme = action.payload.theme;
            state.language = action.payload.language;
            state.preserveOpenTabs = action.payload.preserveOpenTabs;
            state.dataPath = action.payload.dataPath;
        },
        updateActiveTabs: (state, action: PayloadAction<string[]>) => {
            state.activeTabs = action.payload;
        }
    },
})

export const {updateSettings, updateActiveTabs} = configSlice.actions

export default configSlice.reducer
