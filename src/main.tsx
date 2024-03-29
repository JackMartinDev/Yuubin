import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import '@mantine/core/styles.css';
import { store } from './store/store'
import { Provider } from 'react-redux'
import { MantineProvider } from "@mantine/core";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <MantineProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </MantineProvider>
    </React.StrictMode>,
);
