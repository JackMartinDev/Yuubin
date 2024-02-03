import Client from "./components/Client/Client"
import FileTree from "./components/FileTree/FileTree";

function App(): JSX.Element {
    return (
        <div className="container">
            <FileTree />
            <Client/>
        </div>
    )
}

export default App
