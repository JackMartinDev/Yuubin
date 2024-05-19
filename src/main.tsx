import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { store } from './store/store'
import { Provider } from 'react-redux'
import { MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

const theme = createTheme({
  cursorType: 'pointer',
});


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <MantineProvider theme={theme}>
            <ModalsProvider>
            <Provider store={store}>
                <App />
            </Provider>
            </ModalsProvider>
        </MantineProvider>
    </React.StrictMode>,
);
