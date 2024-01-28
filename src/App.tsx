import Client from "./components/Client/Client"
import { listen } from '@tauri-apps/api/event'

type Payload = {
    message: string;
}

async function startSerialEventListener() {
    await listen<Payload>('event-name', (event) => {
        console.log("Event triggered from rust!\nPayload: " + event.payload.message);
    });
}

async function startFileEventListener() {
    await listen<Payload>('event', (event) => {
        console.log("Event triggered from rust!\nPayload: " + event.payload.message);
    });
}
function App(): JSX.Element {
    startSerialEventListener();
    startFileEventListener();
    return (
        <div className="container">
            <Client/>
        </div>
    )
}

export default App
