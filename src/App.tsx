import Client from "./components/Client/Client"
import FileTree from "./components/FileTree/FileTree";
import classes from "./App.module.css"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
function App(): JSX.Element {
    return (
        <div onContextMenu={(e) => {e.preventDefault();}} className={classes.container}>

            <PanelGroup direction="horizontal">
                <Panel defaultSize={20} minSize={15}>
                    <div className={classes.file}>
                        <FileTree />
                    </div>
                </Panel>
                <PanelResizeHandle />
                <Panel defaultSize={80} minSize={70}>
                    <div className={classes.client}>
                        <Client/>
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    )
}

export default App
