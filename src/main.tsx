import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import '@mantine/core/styles.css';
import { store } from './store/store'
import { Provider } from 'react-redux'
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <MantineProvider>
            <ModalsProvider>
            <Provider store={store}>
                <App />
            </Provider>
            </ModalsProvider>
        </MantineProvider>
    </React.StrictMode>,
);
