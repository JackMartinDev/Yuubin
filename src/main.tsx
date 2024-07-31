import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { store } from './redux/store/store'
import { Provider } from 'react-redux'
import { MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translationsEn } from "./translations/en"
import { translationsJp } from "./translations/jp"

const theme = createTheme({
  cursorType: 'pointer',
});


i18next.use(initReactI18next).init({
    resources:{
        en: { translation: translationsEn},
        jp: { translation: translationsJp}
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false},
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <MantineProvider theme={theme} defaultColorScheme="light">
        <ModalsProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </ModalsProvider>
    </MantineProvider>
);
