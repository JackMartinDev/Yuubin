import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ConfigState{
    config: Config
}

const initialState: Config = {
    activeTabs: [],
    dataPath: "",
    preserveOpenTabs: false,
    saveOnQuit: false,
    language: "en",
    theme: "light"
}

export const configSlice = createSlice({
    name: "config",
    initialState,
    reducers: {
        updateConfig: (state, action: PayloadAction<Config>) => {
            state.activeTabs = action.payload.activeTabs;
            state.theme = action.payload.theme;
            state.language = action.payload.language;
            state.preserveOpenTabs = action.payload.preserveOpenTabs;
            state.dataPath = action.payload.dataPath;
            state.saveOnQuit = action.payload.saveOnQuit;
        },
    },
})

export const {updateConfig} = configSlice.actions

export default configSlice.reducer
